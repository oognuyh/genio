import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logoImage from "../../assets/big-logo.png";
import logoText from "../../assets/logo-text.png";
import "./splashScreen.css";

const SplashScreen = () => {
  const navigate = useNavigate();
  const [isComplete, setIsComplete] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [animateLogo, setAnimateLogo] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // 3초 후 로고 이동 & 회전 애니메이션 실행
    const logoTimer = setTimeout(() => {
      setAnimateLogo(true);
      setTimeout(() => {
        setShowText(true); // 로고 이동이 끝난 후 텍스트 페이드인
      }, 1000); // 로고 이동 종료 1초 후부터 텍스트 등장
    }, 1000);

    // 3.5초 후 버튼 나타나기
    const completeTimer = setTimeout(() => {
      setIsComplete(true);
    }, 3000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(completeTimer);
    };
  }, []);

  // 클릭 시 애니메이션 효과 후 페이지 이동
  const handleMouseDown = () => {
    setIsClicked(true);
  };

  const handleMouseUp = () => {
    setTimeout(() => {
      navigate("/resume-check");
    }, 500);
  };

  return (
    <div className="splash-body">
      <div className="splash-container">
        {/* 로고 애니메이션 적용 */}
        <div
          className="logo-wrapper"
          style={{ position: "relative", display: "inline-block" }} // 수정된 부분
        >
          <motion.img
            src={logoImage}
            alt="Genio Logo"
            className="splash-logo"
            initial={{ opacity: 0, y: -50 }}
            animate={{
              opacity: 1,
              y: 0,
              x: animateLogo ? -130 : 0, // 더 시원한 이동 느낌
              rotate: animateLogo ? -90 : 0, // 시계 반대 방향으로 90도 회전
            }}
            transition={{ duration: 1, ease: "easeInOut" }} // 부드러운 애니메이션 적용
          />

          {/* 로고 텍스트 (이동 완료 후 페이드인) */}
          {showText && (
            <motion.img
              src={logoText}
              alt="Genio"
              className="logo-text"
              style={{
                position: "absolute",
                left: "calc(100% - 100px)", // 로고 이미지 오른쪽에 10px 간격
                top: "50%",
                transform: "translateY(-50%)",
              }} // 수정된 부분
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          )}
        </div>

        {/* 정적인 텍스트 */}
        <div className="sp-message-container">
          <p className="message-line">
            <strong>제니오</strong>와 함께 나만의 강점을 발견하세요.
          </p>
          <p className="message-line">
            이력서를 올리거나 직접 입력하면 <strong>퍼스널 브랜딩 키트</strong>를 만들어드려요.
          </p>
        </div>

        {/* 버튼 애니메이션 */}
        {isComplete && (
          <div className="button-group">
            <motion.button
              className={`btn ${isClicked ? "clicked" : ""}`}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              키트 생성 시작하기
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SplashScreen;
