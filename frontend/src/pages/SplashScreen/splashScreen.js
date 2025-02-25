import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactTyped } from "react-typed";
import { motion } from "framer-motion"; // 🔹 애니메이션 효과 추가
import logoImage from "../../assets/logo.png";
import logoText from "../../assets/logo-text.png";
import "./splashScreen.css";

const SplashScreen = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lines, setLines] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isClicked, setIsClicked] = useState(false); // ✅ 클릭 상태 추가

  const sentences = [
    "AI 브랜딩 파트너 제니오와 함께 <strong>나만의 차별화된 강점</strong>을 찾아서!",
    "이력서를 업로드하거나 프로필을 작성하면 <strong>퍼스널 브랜딩 키트</strong>를 생성해드려요.",
  ];

  useEffect(() => {
    if (currentIndex < sentences.length) {
      const timer = setTimeout(() => {
        setLines((prevLines) => [...prevLines, sentences[currentIndex]]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setTimeout(() => {
        setIsComplete(true);
      }, 3000);
    }
  }, [currentIndex]);

  // ✅ 클릭 시 애니메이션 효과 추가 후 페이지 이동
  const handleMouseDown = () => {
    setIsClicked(true);
  };

  const handleMouseUp = () => {
    setTimeout(() => {
      navigate("/resume-check");
    }, 500); // 클릭 효과 후 페이지 전환
  };

  return (
    <div className="splash-body">
      <div className="splash-container">
        {/* 로고 애니메이션 */}
        <motion.div
          className="splash-logo-wrapper"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <img src={logoImage} alt="Genio Logo" className="splash-logo" />
        </motion.div>

        {/* 로고 텍스트 애니메이션 */}
        <motion.div
          className="logo-text-wrapper"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        >
          <img src={logoText} alt="Genio" className="logo-text" />
        </motion.div>

        {/* 메시지 타이핑 효과 */}
        <div className="message-container">
          {lines.map((line, idx) => (
            <div key={idx} className="typed-line">
              <ReactTyped strings={[line]} typeSpeed={20} showCursor={false} loop={false} />
            </div>
          ))}
        </div>

        {/* 버튼 애니메이션 */}
        {isComplete && (
          <div className="button-group">
            <motion.button
              className={`btn ${isClicked ? "clicked" : ""}`} // 클릭 시 추가 클래스
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileTap={{ scale: 0.9 }} // 클릭 시 작아짐 효과
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
