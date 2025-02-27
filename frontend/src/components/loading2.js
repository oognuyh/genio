import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import loadingImage from "../assets/loading2.png";
import "./loading2.css";

const Loading2 = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/branding-result"); // ✅ 로딩 후 키트 생성 페이지로 이동
    }, 3000); // 3초 후 이동
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="loading2-body">
      <p className="loading-text">제니오가 빠르게 브랜딩 키트를 생성하고 있어요. ⚒️</p>
      <img src={loadingImage} alt="로딩 중" className="loading-image" />
    </div>
  );
};

export default Loading2;
