import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 네비게이션 추가
import ProgressSteps from "../../components/ProgressSteps";

import "./brandingTone.css";

const BrandingTone = () => {
  const navigate = useNavigate(); // ✅ useNavigate 훅 사용
  const currentStep = 4; // ✅ 현재 진행단계 4단계

  // ✅ 브랜드 톤 선택 상태 관리
  const [selectedTone, setSelectedTone] = useState("");

  // ✅ 브랜드 톤 선택 핸들러
  const handleToneSelect = (tone) => {
    setSelectedTone(tone);
  };

  // ✅ 다음 페이지 이동
  const onNextClick = () => {
    if (!selectedTone) {
      alert("브랜딩 톤을 선택해주세요!");
      return;
    }
    navigate("/loading2"); // ✅ 다음 페이지로 이동
  };

  // ✅ 선택 가능한 브랜드 톤 리스트
  const brandingTones = [
    { title: "열정적인", description: "도전과 열정을 강조하고 싶은 경우" },
    { title: "진정성 있는", description: "상대방과 신뢰를 쌓으며 소통하고 싶은 경우" },
    { title: "창의적인", description: "나만의 독특한 차별성을 강조하고 싶은 경우" },
    { title: "전문적인", description: "실력과 노하우를 강조하고 싶은 경우" },
    { title: "친근한", description: "유쾌하고 다정한 느낌을 강조하고 싶은 경우" },
  ];

  return (
    <div className="branding-tone-body">
      <ProgressSteps currentStep={currentStep} />

      <div className="branding-tone-container">
        <h2 className="branding-tone-title">마지막으로 브랜딩 톤을 선택해주세요.</h2>
        <p className="sub-text">용우님이 원하는 브랜딩 톤을 선택하세요. 제니오가 느낌을 잘 살려볼게요!</p>

        <div className="branding-tone-list">
          {brandingTones.map((tone, index) => (
            <button
              key={index}
              className={`branding-tone-item ${selectedTone === tone.title ? "selected" : ""}`}
              onClick={() => handleToneSelect(tone.title)}
            >
              <div className="branding-tone-title">{tone.title}</div>
              <div className="branding-tone-description">{tone.description}</div>
            </button>
          ))}
        </div>

        {/* ✅ 선택한 경우에만 "다음" 버튼 표시 */}
        {selectedTone && <button className="branding-tone-next-btn" onClick={onNextClick}>다음</button>}
      </div>
    </div>
  );
};

export default BrandingTone;
