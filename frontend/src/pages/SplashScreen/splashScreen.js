import React, { useEffect, useState, useMemo } from "react";
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

  // 배경 그라디언트 배열
  const gradients = [
    "linear-gradient(90deg, #72C7CB 14%, #8381FC 100%)",
    "linear-gradient(90deg, #EE7EB1 14%, #CF3E42 99%)",
    "linear-gradient(90deg, #D8AAEB 14%, #8B8DF6 99%)",
  ];
  const [gradientIndex, setGradientIndex] = useState(0);

  // 타이핑 효과 관련 상태
  const [typedTitle, setTypedTitle] = useState("");
  const [typedDescription, setTypedDescription] = useState("");
  const [typingComplete, setTypingComplete] = useState(false);
  const [startTyping, setStartTyping] = useState(false);

  // kitData는 고정값이므로 useMemo로 메모이제이션
  const kitData = useMemo(
    () => [
      {
        background: gradients[0],
        chipColor: "#8284FA",
        title: "변화에 빠른, 끝장 보는 백엔드 개발자",
        description: `백엔드 개발 3년차로, 맡은 일은 끝장을 보는 성격입니다. 동료들과 소통하며 일하는 것을 즐기며 문제가 발생하면 다양한 방법을 시도해 빠르게 해결합니다.`,
        chips: ["#백엔드 개발자", "#책임의화신", "#협력플레이어", "#기술전도사"],
      },
      {
        background: gradients[1],
        chipColor: "#D03F44",
        title: "세밀한 눈과 문제 해결 능력을 갖춘 UXUI 디자이너",
        description: `세심한 관찰력과 문제 해결 능력을 갖춘 신입 UXUI 디자이너입니다. 다양한 툴을 능숙하게 다루며, 팀 프로젝트에서는 원활한 커뮤니케이션을 주도하며, 사용자 중심의 디자인을 추구합니다.`,
        chips: ["#디테일장인", "#디자인시스템", "#피그마마스터", "#신입디자이너"],
      },
      {
        background: gradients[2],
        chipColor: "#8D8EF6",
        title: "함께 가치있는 답을 찾는 AI 개발자",
        description: `항상 상대방 입장에서 생각하며 문제가 생기면 끝까지 파고들어 해결하는 7년차 AI 개발자입니다. 이런 강점을 바탕으로 딥러닝 기반 이미지 인식 모델 개발 등 다양한 AI 프로젝트를 성공적으로 수행했습니다.`,
        chips: ["#인공지능전문가", "#협력플레이어", "#문제해결사", "#기술전도사"],
      },
    ],
    [gradients]
  );

  // 로고와 버튼 애니메이션 (초기 3초)
  useEffect(() => {
    const logoTimer = setTimeout(() => {
      setAnimateLogo(true);
      setTimeout(() => {
        setShowText(true);
      }, 1000);
    }, 1000);

    const completeTimer = setTimeout(() => {
      setIsComplete(true);
    }, 3000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(completeTimer);
    };
  }, []);

  // 버튼 애니메이션 완료 후 1초 지연 후 첫 타이핑 시작
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        setStartTyping(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  // gradientIndex 변경 시(kit 전환) 1초 후 타이핑 효과 재시작
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        setStartTyping(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gradientIndex, isComplete]);

  // 타이핑 효과 구현@@@@@@@@@
  useEffect(() => {
    if (!startTyping) return;
    let titleInterval;
    let descInterval;
    const currentTitle = kitData[gradientIndex].title;
    const currentDescription = kitData[gradientIndex].description;

    // 타이핑 상태 초기화 25가 속도 딱 맞음..
    setTypedTitle("");
    setTypedDescription("");
    setTypingComplete(false);

    let titleIndex = 0;
    titleInterval = setInterval(() => {
      titleIndex++;
      setTypedTitle(currentTitle.slice(0, titleIndex));
      if (titleIndex >= currentTitle.length) {
        clearInterval(titleInterval);
        let descIndex = 0;
        descInterval = setInterval(() => {
          descIndex++;
          setTypedDescription(currentDescription.slice(0, descIndex));
          if (descIndex >= currentDescription.length) {
            clearInterval(descInterval);
            setTypingComplete(true);
          }
        }, 25);
      }
    }, 25);

    return () => {
      clearInterval(titleInterval);
      clearInterval(descInterval);
    };
  }, [startTyping, gradientIndex]);

  useEffect(() => {
    if (typingComplete) {
      const timer = setTimeout(() => {
        setGradientIndex((prevIndex) => (prevIndex + 1) % gradients.length);
        setStartTyping(false);
        setTypingComplete(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [typingComplete, gradients.length]);

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
      {/* 그라디언트 오버레이 */}
      <div
        className="gradient-overlay"
        style={{
          background: gradients[gradientIndex],
          opacity: 0.35,
          transition: "background 1s ease",
        }}
      />
      <div className="splash-container">
        {/* 로고 애니메이션 */}
        <div
          className="logo-wrapper"
          style={{ position: "relative", display: "inline-block" }}
        >
          <motion.img
            src={logoImage}
            alt="Genio Logo"
            className="splash-logo"
            initial={{ opacity: 0, y: -50 }}
            animate={{
              opacity: 1,
              y: 0,
              x: animateLogo ? -130 : 0,
              rotate: animateLogo ? -90 : 0,
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />

          {/* 로고 텍스트 (애니메이션 후 페이드인) */}
          {showText && (
            <motion.img
              src={logoText}
              alt="Genio"
              className="logo-text"
              style={{
                position: "absolute",
                left: "calc(100% - 100px)",
                top: "50%",
                transform: "translateY(-50%)",
              }}
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
            이력서를 올리거나 직접 입력하면{" "}
            <strong>퍼스널 브랜딩 키트</strong>를 만들어드려요.
          </p>
        </div>

        {/* 버튼 및 kit 미리보기 박스 */}
        {isComplete && (
          <>
            {/* 시작하기 버튼 */}
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
                시작하기
              </motion.button>
            </div>

            {/* 키트 미리보기 박스 */}
            <div
              className="kit-basic"
              style={{ background: kitData[gradientIndex].background }}
            >
              <div className="text_set">
                <div className="title-text">{typedTitle}</div>
                <div className="des-text">{typedDescription}</div>
              </div>

              <div className="chip_set">
                {kitData[gradientIndex].chips.map((chip, idx) => (
                  <div className="chip" key={idx}>
                    <div
                      className="label-text"
                      style={{ color: kitData[gradientIndex].chipColor }}
                    >
                      {chip}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SplashScreen;
