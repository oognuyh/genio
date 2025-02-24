import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactTyped } from "react-typed";

const SplashScreen = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 출력할 문장 인덱스
  const [lines, setLines] = useState([]); // 출력된 문장 리스트
  const [isComplete, setIsComplete] = useState(false); // 모든 문장 출력 완료 여부

  // 출력할 문장 리스트
  const sentences = [
    "안녕하세요! Genio에 오신 것을 환영합니다.✨",
    "몇 가지 키워드만 입력하면 나만의 셀프 브랜딩 키트가 완성됩니다.",
    "지금 바로 시작해볼까요?",
  ];

  useEffect(() => {
    if (currentIndex < sentences.length) {
      const timer = setTimeout(() => {
        setLines((prevLines) => [...prevLines, sentences[currentIndex]]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, 2000); // 2초 간격으로 한 줄씩 추가

      return () => clearTimeout(timer);
    } else {
      // 모든 문장이 출력된 후 완료 상태 변경
      setTimeout(() => {
        setIsComplete(true);
      }, 500); // 마지막 문장이 출력된 후 0.5초 대기
    }
  }, [currentIndex]);

  return (
    <div className="container">
      <h1 className="big-text">
        {lines.map((line, idx) => (
          <div key={idx} className="typed-line">
            <ReactTyped
              strings={[line]}
              typeSpeed={30}
              showCursor={false}
              loop={false} // 글자가 지워지지 않도록 설정
            />
          </div>
        ))}
      </h1>

      {/* 모든 문장이 출력된 후 버튼 표시 */}
      {isComplete && (
        <div className="button-group">
          <button className="btn" onClick={() => navigate("/resume-check")}>
            시작하기
          </button>
        </div>
      )}
    </div>
  );
};

export default SplashScreen;
