import React from "react";
import { useNavigate } from "react-router-dom";

const ResumeCheck = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1 className="big-text nowrap-text">
        똑똑한 Genio와 함께 셀프 브랜딩 키트를 만들어보세요.
      </h1>
      <div className="button-group">
        <button onClick={() => navigate("/resume-yes")} className="btn">
          제니오에게 이력서 맡기기
        </button>
        <button onClick={() => navigate("/resume-no")} className="btn">
          제니오와 직접 대화하기
        </button>
      </div>
    </div>
  );
};

export default ResumeCheck;
