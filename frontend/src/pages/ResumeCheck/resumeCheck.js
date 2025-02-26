import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./resumeCheck.css";

const ResumeCheck = () => {
  const navigate = useNavigate();

  return (
    <div className="resume-body">
      <div className="resume-container">
        {/* 로고 및 텍스트 박스 */}
        <div className="header">
          <img src={logo} alt="logo" className="resume-logo" />
          <div className="text-box">
            <h2>프로필 작성 방법을 선택해주세요.</h2>
            <p>원하는 프로필 작성 방식을 골라주세요.</p>
          </div>
        </div>

        {/* 카드 컨테이너 */}
        <div className="card-container">
          {/* 이력서 업로드 박스 */}
          <div className="card">
            <p className="card-title">이력서 파일을 업로드하면</p>
            <p className="card-desc">
              스타일, 강점 등을 분석해 정보를 자동으로 입력해줘요.
            </p>
            <div className="empty-box"></div>
            <button onClick={() => navigate("/resume-upload")} className="btn">
              이력서 맡기기
            </button>
          </div>

          {/* 직접 입력 박스 */}
          <div className="card">
            <p className="card-title">이력서가 없다면 직접 입력도 가능해요.</p>
            <p className="card-desc">
              스타일, 강점 등을 통해 원하는 방향에 맞춰 프로필이 생성돼요.
            </p>
            <div className="empty-box"></div>
            <button onClick={() => navigate("/resume-no")} className="btn">
              직접 작성하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeCheck;
