import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import ProgressSteps from "../../components/ProgressSteps";
import LoadingScreen from "../../components/loadingScreen";

import checkIcon from "../../assets/check.png";
import checkWhiteIcon from "../../assets/check-white.png";

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
       // 메시지 큐 및 상태 관리
       let socket = null;
       const messageQueue = [];
       let isProcessing = false;
       
       // 지연 함수
       const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
       
       // 메시지 처리 함수
       const processMessageQueue = async () => {
 
         if (isProcessing || messageQueue.length === 0) return;
         
         isProcessing = true;
 
         while (messageQueue.length > 0) {
           const data = messageQueue.shift();
           
           try {
             const response = JSON.parse(data);
             console.log("파싱된 객체:", response);
             
             // 메시지 표시
             setProgessMessage(response.message);
             
             // 메시지 타입에 따른 처리
             if (response.type === 'completed' || response.type === 'failed') {
               // 마지막 메시지 표시를 위한 딜레이
               await delay(1500);
               
               // 소켓 종료 및 로딩 상태 해제
               if (socket && socket.readyState === WebSocket.OPEN) {
                 socket.close();
               }
               setIsLoading(false);
               
               // completed인 경우 페이지 이동
               if (response.type === 'completed' && response.result) {
                 navigate("/branding-result", { state: response.result });
               }
               
               break;
             }
             
             // running 메시지는 딜레이 후 다음 처리
             await delay(1500);
             
           } catch (err) {
             console.error("메시지 처리 중 오류:", err);
             setProgessMessage("알 수 없는 오류가 발생했어요. 다시 시도해주세요.");
             await delay(1500);
             
             if (socket && socket.readyState === WebSocket.OPEN) {
               socket.close();
             }
             setIsLoading(false);
             break;
           }
         }
 
         isProcessing = false;
       };
       
       // WebSocket 연결
       socket = new WebSocket(`${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/api/v1/cards/stream`);
       
       // 이벤트 핸들러
       socket.onopen = () => {
         console.log("WebSocket 연결됨");
         
         socket.send(JSON.stringify(resumeData))
       };
       
       socket.onmessage = (event) => {
         if (typeof event.data === 'string') {
           console.log("메시지 수신");
           messageQueue.push(event.data);
           if (!isProcessing) {
             processMessageQueue();
           }
         }
       };
       
       socket.onerror = (error) => {
         console.error("WebSocket 오류:", error);
         setProgessMessage("연결 중 오류가 발생했어요.");
         setIsLoading(false);
       };
       
       socket.onclose = (event) => {
         console.log("WebSocket 연결 종료:", event.code, event.reason);
       };
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
            원하는 브랜딩 톤을 선택하세요. 제니오가 느낌을 잘 살려볼게요!
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
      {isLoading && <LoadingScreen currentStep={currentStep} />}
    </>
  );
};

export default BrandingTone;
