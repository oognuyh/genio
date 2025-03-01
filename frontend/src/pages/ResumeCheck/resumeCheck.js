import React from "react";
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
      className="resume-body"
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover" }}
    >
      {/* 최상단 중앙 로고 */}
      <img src={logo} alt="logo" className="resume-logo" />

      <div className="resume-container">
        {/* 텍스트 박스 */}
        <div className="header">
          <div className="text-box">
            <h2>프로필 작성 방법을 선택해주세요.</h2>
            <p>
              이력서 맡기기와 직접 작성하기 중 원하는 프로필 작성 방법을 고르면,{" "}
              <br />
              AI 브랜딩 파트너 제니오가 빠르게 나만의 퍼스널 브랜딩 키트를
              생성해드릴게요!
            </p>
          </div>
        </div>

        {/* 카드 컨테이너 */}
        <div className="card-container">
          {/* 첫 번째 카드 */}
          <div className="card">
            <img src={bt1Image} alt="Upload Resume" />
            <button onClick={() => navigate("/resume-upload")} className="btnF">
              이력서 맡기기
            </button>
            <p className="card-desc">
              이력서 파일을 업로드하면 프로필 정보를 자동으로 입력해줘요.
            </p>
          </div>

          {/* 두 번째 카드 */}
          <div className="card">
            <img src={bt2Image} alt="Manual Entry" />
            <button onClick={() => navigate("")} className="btnF">
              직접 작성하기
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
