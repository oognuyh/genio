import React, { useState } from "react";
import logo from "../../assets/logo.png";
import fileIcon from "../../assets/file.png";
import successIcon from "../../assets/success.png";
import failIcon from "../../assets/fail.png";
import axios from "axios";
import "./resumeUpload.css";

const ResumeUpload = () => {
  const [file, setFile] = useState(null); // 업로드된 파일 저장
  const [error, setError] = useState(""); // 파일 크기 초과 에러 메시지
  const [dragOver, setDragOver] = useState(false); // 드래그 상태 확인

  const onTest = async () => {
    const data = await axios.get("api/v1/job-categories");

    console.log(data.data);
  };

  // 이력서 전송 API호출 및 분석 정보 받아오기
  const onGenerateBrandKit = async () => {
    console.log(file);

    const formData = new FormData();
    formData.append("file", file);

    const resumeInfo = await axios
      .post("api/v1/resumes", formData, {
        headers: {
          accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(resumeInfo.data);
  };

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
            <span className= "title1">
              먼저, 퍼스널 브랜딩 키트 생성을 위해 분석할 프로필 정보가
              필요해요.<br />
            </span>
            <span className= "title2">
              이력서 파일을 업로드하면 제니오가 프로필 정보를 자동으로
              입력해드려요.
            </span>
          </div>
        </div>

        {/* 파일 업로드 영역 */}
        <div className="upload-container">
          <label
            className={`upload-box ${error ? "error" : file ? "success" : ""} ${
              dragOver ? "drag-over" : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".pdf,.docx,.md"
              hidden
            />

            {error ? (
              <>
                <span className="error-icon">
                  <img src={failIcon} alt="file" className="upload-fail-icon" />
                </span>
                <p className="error-text">{error}</p>
                <p className="retry-text">다시 올리기</p>
              </>
            ) : file ? (
              <>
                <span className="success-icon">
                  <img src={successIcon} alt="file" className="upload-success-icon" />
                </span>
                <p className="file-name">{file.name}</p>
                <p className="file-size">
                  {(file.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </>
            ) : (
              <>
                <span className="upload-icon">
                  <img src={fileIcon} alt="file" className="upload-file-icon" />
                </span>
                <p className="upload-info">
                  여기를 클릭하거나 드래그 앤 드롭으로 파일을 업로드해주세요.
                  <br />
                  10MB 미만의 PDF, .docx, .md만 가능해요.
                </p>
              </>
            )}
          </label>
        </div>

        {/* 버튼 */}
        <button className="upload-btn" onClick={onGenerateBrandKit}>
          나만의 브랜드 키트 만들기
        </button>
        <p className="direct-text" onClick={onTest}>
          프로필 직접 입력
        </p>
      </div>
    </div>
  );
};

export default ResumeUpload;
