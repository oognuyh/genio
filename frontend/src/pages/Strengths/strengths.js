import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ProgressSteps from "../../components/ProgressSteps";
import checkIcon from "../../assets/check.png";
import checkWhiteIcon from "../../assets/check-white.png";
import "./strengths.css";

const Strengths = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentStep = 3;

  const [resumeData, setResumeData] = useState(location?.state || {});
  // ✅ 선택된 강점 상태 관리
  const [selectedStrengths, setSelectedStrengths] = useState([]);
  const [strengthsList, setStrengthsList] = useState([]);

  // ✅ Axios를 사용하여 강점 리스트 가져오기
  useEffect(() => {
    axios
      .get("/api/v1/strengths")
      .then((response) => {
        console.log("[Strengths] Fetched Data:", response.data);
        setStrengthsList(response.data.map((item) => item.value));
      })
      .catch((error) => {
        console.error("[Strengths] Error fetching strengths:", error);
      });
  }, []);

  // ✅ 강점 선택 핸들러 (개수 제한 없음)
  const handleStrengthSelect = (strength) => {
    setSelectedStrengths((prev) =>
      prev.includes(strength)
        ? prev.filter((s) => s !== strength)
        : [...prev, strength]
    );
  };

  // ✅ 다음 페이지 이동
  const onNextClick = () => {
    if (selectedStrengths.length < 2) {
      alert("최소 2개 이상의 강점을 선택해주세요!");
      return;
    }
    console.log("[Strengths] 최종 선택한 강점:", selectedStrengths); // ✅ 선택한 데이터 확인
    navigate("/branding-tone", { state: {resumeData, strengths: selectedStrengths } });
  };

  return (
    <div className="strengths-body">
      <ProgressSteps currentStep={currentStep} />

      <div className="strengths-container">
        <h2 className="strengths-title">당신의 강점을 선택하세요</h2>
        <p className="sub-text">본인의 강점과 가장 가까운 항목을 선택해주세요.</p>

        <div className="strengths-list">
          {strengthsList.map((strength, index) => (
            <button
              key={index}
              className={`strength-item ${selectedStrengths.includes(strength) ? "selected" : ""}`}
              onClick={() => handleStrengthSelect(strength)}
            >
              <img
                src={selectedStrengths.includes(strength) ? checkWhiteIcon : checkIcon}
                alt="check"
                className="check-icon"
              />
              {strength}
            </button>
          ))}
        </div>

        {/* ✅ 2개 이상 선택했을 때만 버튼 표시 */}
        {selectedStrengths.length >= 2 && (
          <button className="st-next-btn" onClick={onNextClick}>
            다음
          </button>
        )}
      </div>
    </div>
  );
};

export default Strengths;
