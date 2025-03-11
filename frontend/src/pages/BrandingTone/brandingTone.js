import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import LoadingScreen from "../../components/loadingScreen";
import ProgressSteps from "../../components/progressSteps";

import checkWhiteIcon from "../../assets/check-white.png";
import checkIcon from "../../assets/check.png";

import "./brandingTone.css";

const BrandingTone = () => {
  const currentStep = 4;

  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);

  const [resumeData, setResumeData] = useState(location?.state || {});

  // ✅ 브랜드 톤 선택 상태 관리
  const [selectedTone, setSelectedTone] = useState(null);
  const [progessMessage, setProgessMessage] = useState("");
  const [brandingTones, setBrandingTones] = useState([]);

  // ✅ Axios를 사용하여 브랜드 톤 리스트 가져오기
  useEffect(() => {
    axios
      .get("/api/v1/tones")
      .then((response) => {
        setBrandingTones(response.data);
      })
      .catch((error) => {
        console.error("[BrandingTone] Error fetching tones:", error);
      });
  }, []);

  // ✅ 브랜드 톤 선택 핸들러
  const handleToneSelect = (tone) => {
    resumeData.tone = tone;
    setSelectedTone(tone);
  };

  // ✅ 다음 페이지 이동
  const onNextClick = async () => {
    try {
      if (!selectedTone) {
        alert("브랜딩 톤을 선택해주세요!");
        return;
      }
      setIsLoading(true);

      delete resumeData.resumeId;

      const messageQueue = [];
      let isProcessing = false;

      const response = await fetch(`/api/v1/cards/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resumeData),
      });
      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();

      // 지연 함수
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      // 메시지 처리 함수
      const processMessageQueue = async () => {
        if (isProcessing || messageQueue.length === 0) return;

        isProcessing = true;

        while (messageQueue.length > 0) {
          const data = messageQueue.shift();

          try {
            const response = JSON.parse(data);
            console.log("파싱된 객체:", response);

            setProgessMessage(response.message);

            if (response.type === "completed" || response.type === "failed") {
              await delay(1500);

              setIsLoading(false);

              if (response.type === "completed" && response.result) {
                navigate("/branding-result", {
                  state: {
                    kitData: response.result,
                    resume: resumeData,
                  },
                });
              }

              break;
            }

            await delay(1500);
          } catch (err) {
            console.error("메시지 처리 중 오류:", err);
            setProgessMessage(
              "알 수 없는 오류가 발생했어요. 다시 시도해주세요."
            );
            await delay(1500);

            setIsLoading(false);
            break;
          }
        }

        isProcessing = false;
      };

      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += value;

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          console.log(line);
          if (line.startsWith("data:")) {
            messageQueue.push(line.substring(5));
          }
        }
        if (!isProcessing) {
          processMessageQueue();
        }
      }
    } catch (err) {
      setIsLoading(false);
      console.error("[onGenerateKit] 이력서 분석 중 오류 발생:", err);
    }
  };

  return (
    <>
      <div className="branding-tone-body">
        <ProgressSteps currentStep={currentStep} />

        <div className="branding-tone-container">
          <h2 className="branding-title">
            마지막으로 브랜딩 톤을 선택해주세요.
          </h2>
          <p className="sub-text">
            원하는 브랜딩 톤을 1개 골라주세요. 제니오가 느낌을 잘 살려볼게요!
          </p>

          <div className="branding-tone-list">
            {brandingTones.map((tone, index) => (
              <button
                key={index}
                className={`branding-tone-item ${
                  selectedTone === tone ? "selected" : ""
                }`}
                onClick={() => handleToneSelect(tone)}
              >
                {/* ✅ 선택되었을 때 checkWhiteIcon으로 변경 */}
                <img
                  src={
                    selectedTone?.title === tone.title
                      ? checkWhiteIcon
                      : checkIcon
                  }
                  alt="check"
                  className="check-icon"
                />
                <div className="branding-tone-content">
                  <div className="branding-tone-title">{tone.title}</div>
                  <div className="branding-tone-description">
                    {tone.description}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* ✅ 선택한 경우에만 "다음" 버튼 표시 */}
          {selectedTone && (
            <button className="branding-tone-next-btn" onClick={onNextClick}>
              다음
            </button>
          )}
        </div>
      </div>
      {isLoading && (
        <LoadingScreen currentStep={currentStep} message={progessMessage} />
      )}
    </>
  );
};

export default BrandingTone;
