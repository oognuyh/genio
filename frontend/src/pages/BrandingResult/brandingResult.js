import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import resizer from "react-image-file-resizer";

import colorPaletteImage from "../../assets/color-palette.png";

import ProgressSteps from "../../components/ProgressSteps";

import BasicPreview from "./Preview/basicPreview";
import LinkedinPreview from "./Preview/linkedinPreview";
import InstagramPreview from "./Preview/instagramPreview";

import BasicKit from "../../components/Kits/basicKit";
import LinkedinKit from "../../components/Kits/linkedinKit";
import InstagramKit from "../../components/Kits/instagramKit";

import "./brandingResult.css";

const BrandingResult = () => {
  const currentStep = 5; // ✅ 현재 진행단계 3단계

  const location = useLocation();
  const kitData = location.state || [];

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

  const [kitPlatfrom, setKitPlatform] = useState(platforms[0]);
  const [kitColor, setKitColor] = useState(colors[0]);

  const [fileExt, setFileExt] = useState("png");
  const [fileWidth, setFileWidth] = useState(1020);
  const [fileHeight, setFileHeight] = useState(306);

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

  const onDownloadBtn = () => {
    const kit = document.getElementById("branding-kit");

    const fileName = "genio_kit";
    const fileInfo = {
      ext: fileExt,
      width: fileWidth,
      height: fileHeight,
    };

    domtoimage.toBlob(kit).then(async (blob) => {
      //const file = await resizeFile(blob, fileInfo);
      saveAs(blob, `${fileName}.${fileInfo.ext}`);
    });
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
            제니오가 맞춤형 브랜딩 키드를 준비했어요.
            <b />
            시그니처 컬러는 취향에 맞게, 레이아웃은 용도에 맞게 선택해보세요.
          </p>
        </div>

        {/* 플랫폼 선택 버튼 */}
        <div className="platform-btn-list">
          {platforms.map((platform) => (
            <button
              className={`platform-btn${
                platform == kitPlatfrom ? " active" : ""
              }`}
              onClick={() => onClickPlatform(platform)}
            >
              {platform}
            </button>
          ))}
        </div>

        {/* 컬러 팔레트 */}
        <div className="color-palette">
          <buuton className="color-palette-btn">
            <img className="color-palette-icon" src={colorPaletteImage} />
          </buuton>
          {colors.map((color) => (
            <div
              className={`color-chip${color == kitColor ? " active" : ""}`}
              style={{
                background: `linear-gradient(to left, ${color}, #ffffff 140%)`,
              }}
              onClick={() => setKitColor(color)}
            />
          ))}
        </div>

        <div className="kit-box">
          {/* 조건부 키트 프리뷰 렌더링 */}
          {renderPreview()}
        </div>

        {/* 저장 버튼 */}
        <button className="save-button" onClick={onDownloadBtn}>
          이미지로 저장하기
        </button>

        {/* 이미지 저장을 위한 히든 컴포넌트 */}
        {renderKit()}
      </div>
    </>
  );
};

export default BrandingResult;
