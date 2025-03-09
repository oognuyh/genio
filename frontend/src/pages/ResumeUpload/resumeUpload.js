import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FailIcon from "../../assets/fail.png";
import FileIcon from "../../assets/file.png";
import SuccessIcon from "../../assets/success.png";
import LoadingScreen from "../../components/loadingScreen";
import ProgressSteps from "../../components/ProgressSteps";
import "./resumeUpload.css";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const FileUploadBox = ({ onFileChanged }) => {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // 파일 유효성 검사
  const validateFile = (uploadedFile) => {
    if (!uploadedFile) {
      return null;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/markdown",
    ];
    const fileExtension = uploadedFile.name.split(".").pop().toLowerCase();
    const isValidType =
      allowedTypes.includes(uploadedFile.type) ||
      ["pdf", "docx", "md"].includes(fileExtension);

    if (!isValidType) {
      return "지원하지 않는 파일 형식입니다. PDF, DOCX, MD 파일만 업로드 가능합니다.";
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (uploadedFile.size > maxSize) {
      return "파일 크기가 10MB를 초과합니다.";
    }

    return null;
  };

  // 파일 처리 통합 함수
  const processFile = (uploadedFile) => {
    const validationError = validateFile(uploadedFile);

    if (validationError) {
      setError(validationError);
      setFile(null);
      onFileChanged(null);
      return;
    }

    setFile(uploadedFile);
    setError(null);
    onFileChanged(uploadedFile);
  };

  // 드래그 이벤트 핸들러
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
    processFile(event.dataTransfer.files[0]);
  };

  const handleFileChange = (event) => {
    processFile(event.target.files[0]);
  };

  const handleReupload = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="upload-container">
      <label
        className={`upload-box${error ? " error" : ""}${
          file ? " success" : ""
        }${dragOver ? " drag-over" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        htmlFor="file-upload-input"
      >
        <input
          id="file-upload-input"
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.docx,.md"
          hidden
          aria-label="파일 업로드"
        />

        {error ? (
          <>
            <span className="error-icon" aria-hidden="true">
              <img src={FailIcon} alt="" className="upload-fail-icon" />
            </span>
            <p className="error-text" role="alert">
              {error}
            </p>
            <button
              type="button"
              className="reupload-box"
              onClick={handleReupload}
            >
              다시 업로드
            </button>
          </>
        ) : file ? (
          <>
            <span className="success-icon" aria-hidden="true">
              <img src={SuccessIcon} alt="" className="upload-success-icon" />
            </span>
            <p className="file-name">{file.name}</p>
            <p className="file-size">
              {(file.size / (1024 * 1024)).toFixed(1)} MB
            </p>
            <button
              type="button"
              className="reupload-box"
              onClick={handleReupload}
            >
              다시 업로드
            </button>
          </>
        ) : (
          <>
            <span className="upload-icon" aria-hidden="true">
              <img src={FileIcon} alt="" className="upload-file-icon" />
            </span>
            <p className="file-info">
              여기를 클릭하거나 드래그 앤 드롭으로 파일을 업로드해주세요. <br />
              10MB 미만의 PDF, .docx, .md만 가능해요.
            </p>
          </>
        )}
      </label>
    </div>
  );
};

const Page = () => {
  const currentStep = 1;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null); // 업로드된 파일
  const [message, setMessage] = useState("");

  const handleFileChange = (uploadedFile) => {
    console.log("[handleFile] Uploaded file detected:", uploadedFile);

    setFile(uploadedFile);
  };

  const extractResume = async () => {
    try {
      setIsLoading(true);
      setMessage("");

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(`/api/v1/resumes/stream`, {
        method: "POST",
        body: formData,
      });

      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();

      const messageQueue = [];
      let isProcessing = false;
      const processMessageQueue = async () => {
        if (isProcessing || messageQueue.length === 0) return;

        isProcessing = true;

        while (messageQueue.length > 0) {
          const data = messageQueue.shift();

          try {
            const response = JSON.parse(data);

            console.log("파싱된 객체:", response);

            setMessage(
              response.message.includes("Text too long")
                ? "이력서가 너무 길어서 추출할 수 없어요."
                : response.message
            );

            await delay(1500);

            if (response.type === "completed" || response.type === "failed") {
              setIsLoading(false);

              if (response.type === "completed" && response.result) {
                navigate("/profile", { state: response.result });
              }

              break;
            }
          } catch (err) {
            console.error("메시지 처리 중 오류:", err);
            setMessage("알 수 없는 오류가 발생했어요. 다시 시도해주세요.");

            await delay(1500);

            setIsLoading(false);

            break;
          }
        }

        isProcessing = false;
      };

      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += value;

        const lines = buffer.split("\n");

        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data:")) {
            messageQueue.push(line.substring(5));
          }
        }

        if (!isProcessing) {
          processMessageQueue();
        }
      }
    } catch (e) {
      console.error("[onGenerateKit] 이력서 분석 중 오류 발생:", e);

      setIsLoading(false);
    }
  };

  return (
    <div className="resume-upload-page">
      <div className="resume-upload-appbar">
        <ProgressSteps currentStep={currentStep} />
      </div>

      <main className="resume-upload-main">
        <div className="resume-upload-header">
          <h2 className="resume-upload-header__title">
            이력서를 업로드해주세요.
          </h2>
          <p className="resume-upload-header__description">
            퍼스널 브랜딩 키트를 만들기 위해 프로필 정보가 필요해요. <br />
            이력서를 업로드하면 제니오가 자동으로 분석해 입력해드릴게요.
          </p>
        </div>

        <div className="resume-upload-container">
          <FileUploadBox onFileChanged={handleFileChange} />
        </div>

        <button
          className={`next-button${file ? "" : " disabled"}`}
          disabled={!file}
          onClick={extractResume}
        >
          다음
        </button>
      </main>

      {isLoading && (
        <LoadingScreen currentStep={currentStep} message={message} />
      )}
    </div>
  );
};

export default Page;
