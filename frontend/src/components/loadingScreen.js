import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import loadingImage1 from "../assets/loading1.png";
import "./loadingScreen.css";

const LoadingScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ResumeUpload에서 넘긴 JSON 데이터
  const [resumeData, setResumeData] = useState(location?.state);

  // 단계별 메시지
  const [loadingMessage, setLoadingMessage] = useState("제니오가 이력서를 분석하고 있어요.");

  useEffect(() => {
    console.log("[LoadingScreen] Received resumeData:", resumeData);
    // 가짜 단계별 로딩 연출
    parseDataInSteps(resumeData);
  }, []);

  // 인위적 딜레이 함수
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const parseDataInSteps = async (data) => {
    try {
      // 1) 이름·직군
      setLoadingMessage("제니오가 이름과 직군 정보를 살펴보고 있어요.");
      await wait(1000);

      // 2) 스킬
      setLoadingMessage("제니오가 보유한 스킬을 분석하고 있어요.");
      await wait(1000);

      // 3) 주요 경험
      setLoadingMessage("제니오가 주요 경험을 정리하고 있어요.");
      await wait(1000);

      // 최종
      setLoadingMessage("제니오가 모든 분석을 마쳤어요!");
      await wait(1000);

      // /profile 페이지로 이동, 최종 데이터 전달
      console.log("[LoadingScreen] Navigate to /profile with data:", data);
      navigate("/profile", { state: data });
    } catch (error) {
      console.error("[LoadingScreen] parseDataInSteps error:", error);
      navigate("/profile");
    }
  };

  return (
    <div className="loading2-body">
      <p className="loading2-text">{loadingMessage}</p>
      <img src={loadingImage1} alt="로딩 중" className="loading-image1" />
    </div>
  );
};

export default LoadingScreen;
