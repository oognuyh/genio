import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import fileIcon from "../../assets/file.png";
import successIcon from "../../assets/success.png";
import failIcon from "../../assets/fail.png";

import ProgressSteps from "../../components/ProgressSteps";
import LoadingScreen from "../../components/loadingScreen";

import "./resumeUpload.css";

const ResumeUpload = () => {
  const currentStep = 1;
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [progessMessage, setProgessMessage] = useState("");

  const [file, setFile] = useState(null); // 업로드된 파일
  const [error, setError] = useState(""); // 파일 크기 초과 에러 메시지
  const [dragOver, setDragOver] = useState(false); // 드래그 상태

  // 디버깅 로그를 위한 함수
  const onGenerateKit = async () => {
    try {
      if (!file) {
        console.log("[onGenerateKit] No file selected. Showing alert.");
        alert("파일을 선택해주세요.");
        return;
      }
      setIsLoading(true);
      console.log("[onGenerateKit] Selected file:", file);

      const formData = new FormData();
      formData.append("file", file); // 파일 정보를 FormData에 추가

      const response = await fetch("/api/v1/resumes/stream", {
        method: "POST",
        body: formData,
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      const delimiter = "\n";

      // 인위적 딜레이 함수 (필요 시 사용)
      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const dataEntries = buffer.split("data:");
        buffer = dataEntries.pop() || "";
        dataEntries.forEach(async (entry) => {
          const trimmedEntry = entry.trim();
          if (!trimmedEntry) return;
          try {
            const jsonData = JSON.parse(trimmedEntry);
            console.log("파싱된 객체:", jsonData);
            setProgessMessage(jsonData.message);
          } catch (error) {
            console.error("JSON 파싱 실패:", trimmedEntry);
          }
        });
      }

      if (buffer.trim()) {
        try {
          const jsonData = JSON.parse(buffer.trim());
          console.log("마지막 데이터:", jsonData);
          setProgessMessage(jsonData.message);
          navigate("/profile", { state: jsonData.result });
        } catch (error) {
          console.error("마지막 데이터 파싱 실패:", buffer);
        }
      }
    } catch (err) {
      setIsLoading(false);
      console.error("[onGenerateKit] 이력서 분석 중 오류 발생:", err);
    }
  };

  // 파일 처리
  const handleFile = (uploadedFile) => {
    if (uploadedFile) {
      console.log("[handleFile] Uploaded file detected:", uploadedFile);
      if (uploadedFile.size > 10 * 1024 * 1024) {
        setFile(null);
        setError("10MB 미만의 PDF 파일만 업로드 가능해요.");
      } else {
        setFile(uploadedFile);
        setError("");
      }
    }
  };

  const handleFileUpload = (event) => {
    console.log("[handleFileUpload] File input changed.");
    const uploadedFile = event.target.files[0];
    handleFile(uploadedFile);
  };

  // 드래그 & 드롭
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
    <>
      <div className="resume-body">
        <div className="resume-container">
          <ProgressSteps currentStep={currentStep} />

          {/* 헤더 */}
          <div className="uploadHeader">
            <div className="text-box">
              <span className="title1">
                이력서를 업로드해주세요.
                <br />
              </span>
              <span className="title2">
                먼저, 퍼스널 브랜딩 키트를 생성을 위해 분석할 프로필 정보가
                필요해요.
                <br />
                이력서 파일을 업로드하면 제니오가 프로필 정보를 자동으로
                입력해드려요.
              </span>
            </div>
          </div>

          {/* 파일 업로드 박스 */}
          <div className="upload-container">
            <label
              className={`upload-box ${
                error ? "error" : file ? "success" : ""
              } ${dragOver ? "drag-over" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                id="reupload-input"
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.docx,.md"
                hidden
              />
              {error ? (
                <>
                  <span className="error-icon">
                    <img
                      src={failIcon}
                      alt="file"
                      className="upload-fail-icon"
                    />
                  </span>
                  <p className="error-text">{error}</p>
                  <button
                    type="button"
                    className="reupload-box"
                    onClick={() =>
                      document.getElementById("reupload-input").click()
                    }
                  >
                    다시 올리기
                  </button>
                </>
              ) : file ? (
                <>
                  <span className="success-icon">
                    <img
                      src={successIcon}
                      alt="file"
                      className="upload-success-icon"
                    />
                  </span>
                  <p className="file-name">{file.name}</p>
                  <p className="file-size">
                    {(file.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                  <button
                    type="button"
                    className="reupload-box"
                    onClick={() =>
                      document.getElementById("reupload-input").click()
                    }
                  >
                    다시 업로드
                  </button>
                </>
              ) : (
                <>
                  <span className="upload-icon">
                    <img
                      src={fileIcon}
                      alt="file"
                      className="upload-file-icon"
                    />
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

          {/* 업로드 버튼: 파일이 있으면 "uploaded" 클래스 추가 */}
          <button
            className={`upload-btn ${file ? "uploaded" : ""}`}
            onClick={onGenerateKit}
          >
            나만의 브랜드 키트 만들기
          </button>
        </div>
      </div>
      {isLoading && (
        <LoadingScreen currentStep={currentStep} message={progessMessage} />
      )}
    </>
  );
};

export default ResumeUpload;
