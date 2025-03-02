import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import bgImage from "../../assets/resumeCheck-background.png";
import bt1Image from "../../assets/resume-button.png";
import bt2Image from "../../assets/direct-button.png";
import "./resumeCheck.css";

const ResumeCheck = () => {
  const navigate = useNavigate();

  return (
    <div
      className="resume-body1"
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover" }}
    >
      {/* 최상단 중앙 로고 */}
      <img src={logo} alt="logo" className="resume-logo" />

      <div className="resume-container">
        {/* 텍스트 박스 */}
        <div className="header">
          <div className="text-box">
            <h2>프로필 작성 방식을 선택해주세요.</h2>
            <p>
              이력서를 업로드하거나 직접 입력할 수 있어요. <br />
              원하는 방법을 선택하면, 제니오가 맞춤형 퍼스널 브랜딩 키트를
              만들어드릴게요.
            </p>
          </div>
        </div>

        {/* 카드 컨테이너 */}
        <div className="card-container">
          {/* 첫 번째 카드 */}
          <div className="card">
            <img src={bt1Image} alt="Upload Resume" />
            <button onClick={() => navigate("/resume-upload")} className="btnF">
              이력서 업로드하기
            </button>
            <p className="card-desc">
              이력서를 업로드하면 프로필 정보가 자동으로 입력돼요.
            </p>
          </div>

          {/* 두 번째 카드 */}
          <div className="card-disabled">
            <img src={bt2Image} alt="Manual Entry" />
            <button className="btnF-disabled">
              직접 입력하기
            </button>
            <p className="card-desc">
              직접 입력 기능은 준비중이에요. 곧 오픈되니 조금만 기다려주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeCheck;
