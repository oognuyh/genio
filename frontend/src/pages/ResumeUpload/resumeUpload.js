import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png"; // 로고 이미지 가져오기
import axios from "axios";
import "./resumeUpload.css"

const ResumeUpload = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null); // 업로드된 파일 저장
  const [error, setError] = useState(""); // 파일 크기 초과 에러 메시지
  const [dragOver, setDragOver] = useState(false); // 드래그 상태 확인

  const onTest = async () => {
    const data = await axios.get("api/v1/job-categories");

    console.log(data.data);
  }

  // 이력서 전송 API호출 및 분석 정보 받아오기
  const onGenerateKit = async () => {
    try {
      console.log(file);

      const fileInfo = {
        file: file
      };

      navigate("/loading-screen", { state: fileInfo });
    } catch (err) {
      console.error("이력서 분석 중 오류가 발생했습니다.", err);
    }
  }

  // // 파일 to Base64 변환
  // const getBase64FromResume = (file) => {
  //   return new Promise(resolve => {
  //     const reader = new FileReader();

  //     // file to base64 문자열 변환
  //     reader.readAsDataURL(file);

  //     reader.onload = () => {
  //       // fileInfo 객체 구성
  //       console.log("Called", reader);
  //       const baseURL = reader.result;
  //       resolve(baseURL);
  //     };
  //   });
  // };

  // 파일 처리 함수 (드래그 & 파일 선택 공통 처리)
  const handleFile = (uploadedFile) => {
    if (uploadedFile) {
      if (uploadedFile.size > 10 * 1024 * 1024) {
        setFile(null);
        setError("10MB 미만의 PDF 파일만 업로드 가능해요.");
      } else {
        setFile(uploadedFile);
        setError("");
      }
    }
  };

  // 파일 선택 핸들러
  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    handleFile(uploadedFile);
  };

  // 드래그 & 드롭 기능 추가
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const uploadedFile = event.dataTransfer.files[0];
    handleFile(uploadedFile);
  };

  return (
    <div className="resume-body">
      <div className="resume-container">
        {/* 로고 및 설명 */}
        <div className="header">
          <img src={logo} alt="logo" className="resume-logo" />
          <div className="text-box">
            <h2>먼저, 분석할 프로필이 필요해요.</h2>
            <p>이력서 파일을 업로드하면 프로필 정보를 자동으로 입력해줘요.</p>
          </div>
        </div>

        {/* 파일 업로드 영역 */}
        <div className="upload-container">
          <label
            className={`upload-box ${error ? "error" : file ? "success" : ""} ${dragOver ? "drag-over" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input type="file" onChange={handleFileUpload} accept=".pdf,.docx,.md" hidden />

            {error ? (
              <>
                <span className="error-icon">❌</span>
                <p className="error-text">{error}</p>
                <p className="retry-text">파일을 다시 선택해주세요.</p>
              </>
            ) : file ? (
              <>
                <span className="success-icon">✅</span>
                <p className="file-name">{file.name}</p>
                <p className="file-size">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
              </>
            ) : (
              <>
                <span className="upload-icon">📂</span>
                <p className="upload-text">파일 선택</p>
                <p className="upload-info">
                  드래그 앤 드롭하여 파일을 업로드해주세요.<br />
                  파일은 10MB 미만의 PDF, .docx, .md 가능해요.
                </p>
              </>
            )}
          </label>
        </div>

        {/* 버튼 */}
        <button className="btn" onClick={onGenerateKit}>나만의 브랜드 키트 만들기</button>
        <p className="direct-text" onClick={onTest}>이력서가 없어요. 직접 입력할래요.</p>
      </div>
    </div>
  );
};

export default ResumeUpload;