import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactTyped } from "react-typed";
import { motion } from "framer-motion"; // 🔹 애니메이션 효과 추가
import logoImage from "../../assets/logo.png";
import logoText from "../../assets/logo-text.png";
import "./splashScreen.css"

const SplashScreen = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lines, setLines] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  const sentences = [
    "안녕하세요! Genio에 오신 것을 환영합니다.✨",
    "몇 가지 키워드만 입력하면 나만의 셀프 브랜딩 키트가 완성됩니다.\n\n\n\n\n\n\n\n\n\n지금 바로 시작해볼까요?",
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

  return (
    <div className="splash-body">
      <div className="splash-container">
        {/* 로고 애니메이션 */}
        <motion.div
          className="splash-logo-wrapper"
          initial={{ opacity: 0, y: -50 }} // 처음엔 위에 있다가
          animate={{ opacity: 1, y: 0 }} // 아래로 자연스럽게 내려옴
          transition={{ duration: 1, ease: "easeOut" }} // 1초 동안 애니메이션
        >
          <img src={logoImage} alt="Genio Logo" className="splash-logo" />
        </motion.div>

        {/* 로고 텍스트 애니메이션 */}
        <motion.div
          className="logo-text-wrapper"
          initial={{ opacity: 0, y: 30 }} // 처음엔 아래쪽에 있다가
          animate={{ opacity: 1, y: 0 }} // 위로 올라오면서 나타남
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }} // 0.5초 지연 후 1초 동안
        >
          <img src={logoText} alt="Genio" className="logo-text" />
        </motion.div>

        {/* 메시지 타이핑 효과 */}
        <div className="message-container">
          {lines.map((line, idx) => (
            <div key={idx} className="typed-line">
              <ReactTyped
                strings={[line]}
                typeSpeed={30}
                showCursor={false}
                loop={false}
              />
            </div>
          ))}
        </div>

        {/* 버튼 애니메이션 */}
        {isComplete && (
          <motion.div
            className="button-group"
            initial={{ scale: 0 }} // 처음에는 작게
            animate={{ scale: 1 }} // 점점 커지면서 등장
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <button className="btn" onClick={() => navigate("/resume-check")}>
              시작하기
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SplashScreen;
