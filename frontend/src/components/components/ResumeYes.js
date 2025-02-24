import React, { useState } from "react";

const ResumeYes = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  // 파일 드래그 앤 드롭 또는 선택 시 처리
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    validateFile(file);
  };

  // 파일 유효성 검사 (PDF & 10MB 이하)
  const validateFile = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("PDF 파일만 업로드 가능합니다.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("파일 크기가 10MB를 초과할 수 없습니다.");
      return;
    }
    setError("");
    setSelectedFile(file);
  };

  // 파일 Drag & Drop 처리
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    validateFile(file);
  };

  return (
    <div className="resume-container">
      <h2 className="title">제니오가 분석할 이력서를 업로드해주세요.</h2>

      <div
        className="upload-box"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {selectedFile ? (
          <p className="file-name">{selectedFile.name}</p>
        ) : (
          <>
            <div className="plus-icon">+</div>
            <p className="file-text">10MB 미만의 PDF 파일</p>
          </>
        )}
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="file-input"
        />
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ResumeYes;
