// ResumeCheck.jsx
import PropTypes from "prop-types";
import React from "react";
import { useNavigate } from "react-router-dom";
import bt2Image from "../../assets/direct-button.png";
import logo from "../../assets/logo.png";
import bt1Image from "../../assets/resume-button.png";
import "./resumeCheck.css";

const Card = ({ children }) => {
  return <div className="resume-check-card">{children}</div>;
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
};

Card.Image = ({ src, alt }) => {
  return <img src={src} alt={alt} className="resume-check-card__image" />;
};

Card.Image.propTypes = {
  src: PropTypes.node.isRequired,
  alt: PropTypes.string.isRequired,
};

Card.Button = ({ children, ...props }) => {
  return (
    <button className="resume-check-card__button" {...props}>
      {children}
    </button>
  );
};

Card.Button.propTypes = {
  children: PropTypes.node.isRequired,
};

Card.Description = ({ children, ...props }) => {
  return (
    <p className="resume-check-card__description" {...props}>
      {children}
    </p>
  );
};

Card.Description.propTypes = {
  children: PropTypes.node.isRequired,
};

const ResumeCheck = () => {
  const navigate = useNavigate();

  return (
    <div className="resume-check-page">
      <div className="resume-check-appbar">
        <img src={logo} alt="logo" className="resume-check-appbar__logo" />
      </div>

      <main className="resume-check-main">
        <div className="resume-check-header">
          <h2 className="resume-check-header__title">
            프로필 작성 방식을 선택해주세요.
          </h2>
          <p className="resume-check-header__subtitle">
            이력서를 업로드하거나 직접 입력할 수 있어요. <br />
            원하는 방법을 선택하면, 제니오가 맞춤형 퍼스널 브랜딩 키트를
            만들어드릴게요.
          </p>
        </div>

        <div className="resume-check-container">
          <Card>
            <Card.Image src={bt1Image} alt="Upload Resume" />
            <Card.Button onClick={() => navigate("/resume-upload")}>
              이력서 업로드하기
            </Card.Button>
            <Card.Description>
              이력서를 업로드하면 프로필 정보가 자동으로 입력돼요.
            </Card.Description>
          </Card>

          <Card>
            <Card.Image src={bt2Image} alt="Manual Entry" />
            <Card.Button
              onClick={() =>
                navigate("/profile", { state: { jobCategory: "개발" } })
              }
            >
              직접 입력하기
            </Card.Button>
            <Card.Description>
              이력서 없어도 직접 입력하면 프로필을 완성할 수 있어요.
            </Card.Description>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ResumeCheck;
