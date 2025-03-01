import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import loadingImage2 from "../assets/loading2.png";

import "./loading2.css";

const Loading2 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [resumeData, setResumeData] = useState(location.state?.data || {});

  // useEffect(() => {
  //   delete resumeData.resumeId;
  //   console.log(JSON.stringify(resumeData));

  //   const postBrandingKit = async () => {
  //     try {
  //       const response = await axios.post("/api/v1/cards", resumeData);
  //       console.log("[onGenerateKit] Server response:", response.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   postBrandingKit();
  // }, []);

  

  return (
    <div className="loading2-body">
      <p className="loading-text">제니오가 빠르게 브랜딩 키트를 생성하고 있어요. ⚒️</p>
      <img src={loadingImage2} alt="로딩 중" className="loading-image2" />
    </div>
  );
};

export default Loading2;