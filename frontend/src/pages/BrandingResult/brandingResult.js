import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import resizer from "react-image-file-resizer";

import popCloseImage from "../../assets/popup-close.png";
import loadingImage2 from "../../assets/loading2.png";

import ProgressSteps from "../../components/progressSteps";

import BasicPreview from "./Preview/basicPreview";
import LinkedinPreview from "./Preview/linkedinPreview";
import InstagramPreview from "./Preview/instagramPreview";
import PortfolioPreview from "./Preview/portfolioPreview";

import BasicKit from "../../components/Kits/basicKit";
import LinkedinKit from "../../components/Kits/linkedinKit";
import InstagramKit from "../../components/Kits/instagramKit";
import PortfolioKit from "../../components/Kits/portfolioKit";

import CustomSection from "../../components/customSection";

import "./brandingResult.css";

const BrandingResult = () => {
  const currentStep = 5; // ✅ 현재 진행단계 3단계

  const navigate = useNavigate();
  const location = useLocation();
  const kitData = location.state || [];

  const [isSaved, setIsSaved] = useState(false);
  const [popupImg, setPopupImg] = useState(null);

  const userName = kitData.name;
  const position = kitData.position;
  const tagline = kitData.tagline;

  const [platforms, setPlatforms] = useState([
    "기본",
    "링크드인",
    "인스타그램",
    "포트폴리오",
  ]);
  const [colors, setColors] = useState(kitData.colors.map((e) => e.value));

  const [hashtags, setHashtags] = useState(
    kitData.hashtags.map((e) => e.value)
  );

  const [kitPlatfrom, setKitPlatform] = useState(platforms[0]); // 선택 플랫폼
  const [kitColor, setKitColor] = useState(colors[0]); // 선택 컬러
  const [kitTypo, setKitTypo] = useState("Pretendard"); // 선택 타이포그래피

  const [fileExt, setFileExt] = useState("png");
  const [fileWidth, setFileWidth] = useState(1020);
  const [fileHeight, setFileHeight] = useState(306);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isShifted, setIsShifted] = useState(false);

  const biography = kitData.biography;

  useEffect(() => {
    console.log(kitData);
  }, []);

  const resizeFile = (file, fileInfo) =>
    new Promise((resolve) => {
      resizer.imageFileResizer(
        file,
        fileInfo.width,
        fileInfo.height,
        `${fileInfo.ext}`,
        999,
        0,
        (uri) => {
          resolve(uri);
        },
        "blob",
        fileInfo.width,
        fileInfo.height
      );
    });

  const onClickPlatform = (platform) => {
    setKitPlatform(platform);
    const platformIdx = platforms.findIndex((e) => e == platform);

    switch (platformIdx) {
      case 0:
        setFileWidth(1020);
        setFileHeight(306);
        break;
      case 1:
        setFileWidth(1584);
        setFileHeight(396);
        break;
      case 2:
        setFileWidth(1080);
        setFileHeight(1080);
        break;
      case 3:
        setFileWidth(1920);
        setFileHeight(1080);
        break;
    }
  };

  const onDownloadBtn = async () => {
    try {
      setIsPreviewOpen(true)

      const kit = document.getElementById("branding-kit");
      const previewKit = document.getElementById("branding-preview-kit");

      const fileName = "genio_kit";
      const fileInfo = {
        ext: fileExt,
        width: previewKit.width * 0.1,
        height: previewKit.height * 0.1,
      };

      setIsSaved(false);
      setIsGenerating(true)

      const [kitBlob, previewBlob] = await Promise.all([
        domtoimage.toBlob(kit),
        domtoimage.toBlob(previewKit)
      ]);


      setPopupImg(window.URL.createObjectURL(previewBlob));
      setIsGenerating(false)

      saveAs(kitBlob, `${fileName}.${fileInfo.ext}`);
      setIsSaved(true);
    } catch (err) {
      console.log(err);
    }
  };

  const renderPreview = () => {
    const platformIdx = platforms.findIndex((e) => e == kitPlatfrom);

    switch (platformIdx) {
      case 0:
        return (
          <BasicPreview
            kitColor={kitColor}
            tagline={tagline}
            biography={biography}
            hashtags={hashtags}
          />
        );
      case 1:
        return (
          <LinkedinPreview
            kitColor={kitColor}
            tagline={tagline}
            position={position}
            hashtags={hashtags}
          />
        );
      case 2:
        return (
          <InstagramPreview
            kitColor={kitColor}
            tagline={tagline}
            biography={biography}
            hashtags={hashtags}
          />
        );
      case 3:
        return (
          <PortfolioPreview
            kitColor={kitColor}
            tagline={tagline}
            hashtags={hashtags}
          />
        );
    }
  };

  const renderKit = () => {
    const platformIdx = platforms.findIndex((e) => e == kitPlatfrom);

    switch (platformIdx) {
      case 0:
        return (
          <BasicKit
            kitColor={kitColor}
            tagline={tagline}
            biography={biography}
            hashtags={hashtags}
          />
        );
      case 1:
        return (
          <LinkedinKit
            kitColor={kitColor}
            tagline={tagline}
            position={position}
            hashtags={hashtags}
          />
        );
      case 2:
        return (
          <InstagramKit
            kitColor={kitColor}
            tagline={tagline}
            biography={biography}
            hashtags={hashtags}
          />
        );
      case 3:
        return (
          <PortfolioKit
            kitColor={kitColor}
            tagline={tagline}
            hashtags={hashtags}
          />
        );
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
          <CustomSection platforms={platforms} colors={colors}
            kitPlatform={kitPlatfrom} kitColor={kitColor} kitTypo={kitTypo}
            setKitPlatform={setKitPlatform} setKitColor={setKitColor} setKitTypo={setKitTypo}
            setIsShifted={setIsShifted} />
          <div className={`kit-box ${isShifted ? "shifted" : ""}`}
            style={{"font-family": kitTypo}}>
          {/* 조건부 키트 프리뷰 렌더링 */}
          {renderPreview()}
        </div>
      </div>

      {/* 저장 버튼 */}
      <button className="save-button" onClick={onDownloadBtn}>
        이미지로 저장하기
      </button>

      {isPreviewOpen && (
        <div className="popup-overlay">
          <div className="popup-save-content">
            <h3 className="popup-intro1">{isGenerating ? '이미지 생성 중' : '이미지 저장 완료!'}</h3>
            <h3 className="popup-intro2">{isGenerating ? '제니오가 열심히 이미지를 만들고 있어요!' : `이제 자신있게 ${userName}님을 세상에 보여주세요 💫`}</h3>
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="popup-close-button">
              <img src={popCloseImage} width="20px" height="20px" alt="close" />
            </button>

            {isGenerating ?
              (<div>
                <img src={loadingImage2} alt="생성 중" className="loading-image1" style={{
                  maxWidth: '80%',
                  maxHeight: '80%',
                  objectFit: 'contain'
                }} />
              </div>) :
              <img src={popupImg} alt="card" />}

            <button
              onClick={() => navigate('/')}
              className="popup-back-button">
              처음으로 돌아가기
            </button>
          </div>
        </div>
      )}

      {/* 이미지 저장을 위한 히든 컴포넌트 */}
      {renderKit()}
    </div >
    </>
  );
};

export default BrandingResult;