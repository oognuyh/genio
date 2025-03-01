import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import loadingImage1 from "../assets/loading1.png";
import loadingImage2 from "../assets/loading2.png";

import "./loadingScreen.css";

const LoadingScreen = ({ currentStep, message }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ResumeUpload에서 넘긴 데이터
  //const [resumeData, setResumeData] = useState(location?.state);
  const [fileInfo, setFileInfo] = useState(location.state?.data);
  const [loadingImg, setLoadingImg] = useState(loadingImage1);

  // 단계별 메시지
  const [loadingMessage, setLoadingMessage] = useState("");

  useEffect(() => {
    console.log(currentStep);

    if(currentStep == 1 && !message) {
      setLoadingMessage("제니오가 매의 눈으로 이력서를 살펴보고 있어요. 👀");
    } else if(currentStep == 4) {
      setLoadingImg(loadingImage2);
      setLoadingMessage("제니오가 맞춤형 브랜딩 키트를 만들고 있어요. 🛠");
    }
  }, [])

  const fetchSSE = async () => {
    await fetch("api/v1/resumes/stream", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fileInfo),
     })
      .then((response) => {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        const readChunk = () => {
          return reader.read().then(appendChunks);
        };

        const appendChunks = (result) => {
          const chunk = decoder.decode(result.value || new Uint8Array(), {
            stream: !result.done,
          });
          const parsedData = JSON.parse(chunk);
          // 받아오는 data로 할 일
          if (parsedData.type == "running") {
            console.log(parsedData.message);
            setLoadingMessage(parsedData.message);
          } else if (parsedData.type == "completed") {
            setLoadingMessage(parsedData.message);

            const resumeInfo = parsedData.result;

            console.log(resumeInfo);
            navigate("/profile", { state: resumeInfo });
          }

          if (!result.done) {
            return readChunk();
          }
        };

        return readChunk();
      })
      .catch((e) => {
        console.log(e);
      });
  };


  // useEffect(() => {
  //   console.log("[LoadingScreen] Received resumeData:", resumeData);
  //   // 가짜 단계별 로딩 연출
  //   parseDataInSteps(resumeData);
  // }, []);

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
      navigate("/resume-upload");
    }
  };

  return (
    <div className="loading2-body">
      <p className="loading2-text">{loadingMessage}</p>
      <img src={loadingImg} alt="로딩 중" className="loading-image1" />
    </div>
  );
};

export default LoadingScreen;