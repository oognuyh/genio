import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import loadingImage2 from "../../assets/loading2.png";
import popCloseImage from "../../assets/popup-close.png";

import ProgressSteps from "../../components/progressSteps";

import BasicPreview from "./Preview/basicPreview";
import InstagramPreview from "./Preview/instagramPreview";
import LinkedinPreview from "./Preview/linkedinPreview";
import PortfolioPreview from "./Preview/portfolioPreview";

import BasicKit from "../../components/Kits/basicKit";
import InstagramKit from "../../components/Kits/instagramKit";
import LinkedinKit from "../../components/Kits/linkedinKit";
import PortfolioKit from "../../components/Kits/portfolioKit";

import CustomSection from "../../components/customSection";

import { styles } from "../../components/brandingCardBox";
import LoadingScreen from "../../components/loadingScreen";
import "./brandingResult.css";

const BrandingResult = () => {
  const currentStep = 5; // ✅ 현재 진행단계 3단계

  const navigate = useNavigate();
  const location = useLocation();
  const [progessMessage, setProgessMessage] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [kitData, setKitData] = useState(
    location.state.kitData
      ? {
          ...location.state.kitData,
          website: "Website URL",
          phone: "(+00) 000 0000 0000",
          email: "genio@pinkfactory.com",
        }
      : {}
  );

  const [isSaved, setIsSaved] = useState(false);
  const [popupImg, setPopupImg] = useState(null);

  const userName = kitData.name;
  const position = kitData.position;
  const tagline = kitData.tagline;
  const resume = location.state.resume || {};

  const [platforms, setPlatforms] = useState([
    "기본",
    "링크드인",
    "인스타그램",
    "포트폴리오",
  ]);

  const [colors, setColors] = useState(kitData.colors.map((e) => e.value));
  const [kitPlatfrom, setKitPlatform] = useState(platforms[0]); // 선택 플랫폼
  const [kitColor, setKitColor] = useState(colors[0]); // 선택 컬러
  const [kitTypo, setKitTypo] = useState("Pretendard"); // 선택 타이포그래피

  const [fileExt, setFileExt] = useState("png");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isShifted, setIsShifted] = useState(false);
  const [isRegeneratingAlertOpen, setIsRegeneratingAlertOpen] = useState(false);

  useEffect(() => {
    console.log(kitData);
  }, []);

  const onDownloadBtn = async () => {
    try {
      setIsPreviewOpen(true);

      const kit = document.getElementById("branding-kit");

      const fileName = "genio_kit";
      const fileInfo = {
        ext: fileExt,
      };

      setIsSaved(false);
      setIsGenerating(true);

      const [kitBlob] = await Promise.all([
        domtoimage.toBlob(kit, {
          width: styles[kitPlatfrom].width,
          height: styles[kitPlatfrom].height,
          style: {
            transform: "scale(1)",
            transformOrigin: "top left",
            width: styles[kitPlatfrom].width,
            height: styles[kitPlatfrom].height,
          },
        }),
      ]);

      setPopupImg(window.URL.createObjectURL(kitBlob));
      setIsGenerating(false);

      saveAs(kitBlob, `${fileName}.${fileInfo.ext}`);
      setIsSaved(true);
    } catch (err) {
      console.log(err);
    }
  };

  const regenerateCard = async () => {
    try {
      setIsRegenerating(true);

      delete resume.resumeId;

      const messageQueue = [];
      let isProcessing = false;

      const response = await fetch(`/api/v1/cards/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resume),
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

              setIsRegenerating(false);

              if (response.type === "completed" && response.result) {
                setKitData({
                  ...response.result,
                  website: "Website URL",
                  phone: "(+00) 000 0000 0000",
                  email: "genio@pinkfactory.com",
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

            setIsRegenerating(false);
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
      setIsRegenerating(false);
      console.error("[onGenerateKit] 이력서 분석 중 오류 발생:", err);
    }
  };

  const renderPreview = () => {
    const platformIdx = platforms.findIndex((e) => e == kitPlatfrom);

    switch (platformIdx) {
      case 0:
        return (
          <BasicPreview
            kitColor={kitColor}
            tagline={kitData.tagline}
            hashtags={kitData.hashtags.map((hashtag) => hashtag.value)}
            biography={kitData.biography}
            onChange={(field, text) => {
              console.log(field, text);
              if (field.startsWith("hashtags")) {
                const [_, i] = field.split(":");
                const index = parseInt(i, 10);

                const updatedHashtags = [...kitData.hashtags];

                if (index >= 0 && index < updatedHashtags.length) {
                  updatedHashtags[index] = text;
                  setKitData({ ...kitData, hashtags: updatedHashtags });
                }
              } else {
                setKitData({ ...kitData, [field]: text });
              }
            }}
          />
        );
      case 1:
        return (
          <LinkedinPreview
            kitColor={kitColor}
            tagline={kitData.tagline}
            position={kitData.position}
            hashtags={kitData.hashtags.map((hashtag) => hashtag.value)}
            onChange={(field, text) => {
              if (field.startsWith("hashtags")) {
                const [_, i] = field.split(":");
                const index = parseInt(i, 10);

                const updatedHashtags = [...kitData.hashtags];

                if (index >= 0 && index < updatedHashtags.length) {
                  updatedHashtags[index] = text;
                  setKitData({ ...kitData, hashtags: updatedHashtags });
                }
              } else {
                setKitData({ ...kitData, [field]: text });
              }
            }}
          />
        );
      case 2:
        return (
          <InstagramPreview
            kitColor={kitColor}
            tagline={kitData.tagline}
            hashtags={kitData.hashtags.map((hashtag) => hashtag.value)}
            biography={kitData.biography}
            onChange={(field, text) => {
              if (field.startsWith("hashtags")) {
                const [_, i] = field.split(":");
                const index = parseInt(i, 10);

                const updatedHashtags = [...kitData.hashtags];

                if (index >= 0 && index < updatedHashtags.length) {
                  updatedHashtags[index] = text;
                  setKitData({ ...kitData, hashtags: updatedHashtags });
                }
              } else {
                setKitData({ ...kitData, [field]: text });
              }
            }}
          />
        );
      case 3:
        return (
          <PortfolioPreview
            kitColor={kitColor}
            tagline={kitData.tagline}
            hashtags={kitData.hashtags.map((hashtag) => hashtag.value)}
            website={kitData.website}
            email={kitData.email}
            phone={kitData.phone}
            onChange={(field, text) => {
              if (field.startsWith("hashtags")) {
                const [_, i] = field.split(":");
                const index = parseInt(i, 10);

                const updatedHashtags = [...kitData.hashtags];

                if (index >= 0 && index < updatedHashtags.length) {
                  updatedHashtags[index] = text;
                  setKitData({ ...kitData, hashtags: updatedHashtags });
                }
              } else {
                setKitData({ ...kitData, [field]: text });
              }
            }}
          />
        );
      default:
        break;
    }
  };

  const renderKit = () => {
    const platformIdx = platforms.findIndex((e) => e == kitPlatfrom);

    switch (platformIdx) {
      case 0:
        return (
          <BasicKit
            kitColor={kitColor}
            tagline={kitData.tagline}
            hashtags={kitData.hashtags.map((hashtag) => hashtag.value)}
            biography={kitData.biography}
          />
        );
      case 1:
        return (
          <LinkedinKit
            kitColor={kitColor}
            tagline={kitData.tagline}
            position={kitData.position}
            hashtags={kitData.hashtags.map((hashtag) => hashtag.value)}
          />
        );
      case 2:
        return (
          <InstagramKit
            kitColor={kitColor}
            tagline={kitData.tagline}
            hashtags={kitData.hashtags.map((hashtag) => hashtag.value)}
            biography={kitData.biography}
          />
        );
      case 3:
        return (
          <PortfolioKit
            kitColor={kitColor}
            tagline={kitData.tagline}
            hashtags={kitData.hashtags.map((hashtag) => hashtag.value)}
            website={kitData.website}
            email={kitData.email}
            phone={kitData.phone}
          />
        );
      default:
        break;
    }
  };

  return (
    <>
      <ProgressSteps currentStep={currentStep} />
      <div className="result-container">
        {/* 상단 소개글 섹션 */}
        <div className="intro-section">
          <h2 className="intro-title">
            {userName}님을 위한 퍼스널 브랜딩이 완성됐어요!
          </h2>
          <p className="intro-text">
            제니오가 맞춤형 브랜딩 키트를 준비했어요.
            <b />
            시그니처 컬러는 취향에 맞게, 레이아웃은 용도에 맞게 선택해보세요.
          </p>
        </div>

        <div className="kit-custom-wrapper">
          <CustomSection
            platforms={platforms}
            colors={colors}
            kitPlatform={kitPlatfrom}
            kitColor={kitColor}
            kitTypo={kitTypo}
            setKitPlatform={setKitPlatform}
            setKitColor={setKitColor}
            setKitTypo={setKitTypo}
            setIsShifted={setIsShifted}
          />
          <div
            className={`kit-box ${isShifted ? "shifted" : ""}`}
            style={{ fontFamily: kitTypo }}
          >
            {/* 조건부 키트 프리뷰 렌더링 */}
            {renderPreview()}
          </div>
        </div>

        {/* 저장 버튼 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          <button
            className="save-button"
            style={{
              background: "#ECEFF4",
              color: "#8995AB",
            }}
            onClick={() => setIsRegeneratingAlertOpen(true)}
          >
            재생성
          </button>
          <button className="save-button" onClick={onDownloadBtn}>
            이미지로 저장하기
          </button>
        </div>

        {isPreviewOpen && (
          <div className="popup-overlay">
            <div className="popup-save-content">
              <h3 className="popup-intro1">
                {isGenerating ? "이미지 생성 중" : "이미지 저장 완료!"}
              </h3>
              <h3 className="popup-intro2">
                {isGenerating
                  ? "제니오가 열심히 이미지를 만들고 있어요!"
                  : `이제 자신있게 ${userName}님을 세상에 보여주세요 💫`}
              </h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="popup-close-button"
              >
                <img
                  src={popCloseImage}
                  width="20px"
                  height="20px"
                  alt="close"
                />
              </button>

              {isGenerating ? (
                <div>
                  <img
                    src={loadingImage2}
                    alt="생성 중"
                    className="loading-image1"
                    style={{
                      maxWidth: "80%",
                      maxHeight: "80%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              ) : (
                <img src={popupImg} alt="card" width="90%" />
              )}

              <button
                onClick={() => navigate("/")}
                className="popup-back-button"
              >
                처음으로 돌아가기
              </button>
            </div>
          </div>
        )}

        {isRegeneratingAlertOpen && (
          <div className="popup-overlay">
            <div className="popup-save-content">
              <h3 className="popup-intro1">
                재생성을 선택하면 이전 퍼스널 브랜딩 키트는 지워져요.
                <br />
                그래도 괜찮으신가요?
              </h3>
              <button
                onClick={() => setIsRegeneratingAlertOpen(false)}
                className="popup-close-button"
              >
                <img
                  src={popCloseImage}
                  width="20px"
                  height="20px"
                  alt="close"
                />
              </button>

              <button
                onClick={() => {
                  setIsRegeneratingAlertOpen(false);
                  regenerateCard();
                }}
                className="popup-back-button"
              >
                재생성
              </button>
            </div>
          </div>
        )}

        {renderKit()}

        {isRegenerating && (
          <LoadingScreen currentStep={4} message={progessMessage} />
        )}
      </div>
    </>
  );
};

export default BrandingResult;
