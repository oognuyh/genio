import React from "react";
import "./progressSteps.css";

const ProgressSteps = ({ currentStep }) => {
  const steps = ["프로필 작성", "프로필 확인", "강점 선택", "브랜딩 선택", "키트 생성"];

  return (
    <div className="progress-container">
      <div className="step-wrapper">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`step ${index < currentStep ? "completed" : ""}`}
          >
            {index !== 0 && <div className="progress-bar"></div>} {/* 단계 간 연결 바 */}
            <span className="step-number">{index + 1}</span>
            <span className="step-text">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressSteps;
