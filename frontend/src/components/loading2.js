import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import loadingImage2 from "../assets/loading2.png";

import "./loading2.css";

const Loading2 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [resumeData, setResumeData] = useState(location.state?.data || {});

  const sessionData = JSON.parse(sessionStorage.getItem('tempResumeData') || '{}');
  const resumeInfo = { ...sessionData, ...resumeData };

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

  useEffect(() => {
    delete resumeInfo.resumeId;
    console.log(resumeInfo);

    const sendData = async () => {
      try {
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(resumeInfo)
        };
        fetch('/api/v1/cards', requestOptions)
          .then(response => response.json())
          .then(data => navigate("/branding-result", { state: data }))
          .catch(e => console.log(e));

        // const response = await axios.post("/api/v1/cards", resumeInfo, {
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   }
        // });

        // 임시 데이터 삭제
        sessionStorage.removeItem('tempResumeData');

        //console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (Object.keys(resumeInfo).length > 0) {
      sendData();
    }
  }, []);

  return (
    <div className="loading2-body">
      <p className="loading-text">제니오가 빠르게 브랜딩 키트를 생성하고 있어요. ⚒️</p>
      <img src={loadingImage2} alt="로딩 중" className="loading-image2" />
    </div>
  );
};

export default Loading2;