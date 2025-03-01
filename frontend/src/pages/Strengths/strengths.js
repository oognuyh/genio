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
        setStrengthsList(response.data.map((item) => item.value));
      })
      .catch((error) => {
        console.error("[Strengths] Error fetching strengths:", error);
      });
  }, []);

  // ✅ 강점 선택 핸들러 (개수 제한 없음)
  const handleStrengthSelect = (strength) => {
    setSelectedStrengths((prev) => {
      if (prev.some((s) => s.value === strength)) {
        // 선택 해제 가능
        return prev.filter((s) => s.value !== strength);
      } else {
        // 3개 이상 선택 방지
        if (prev.length >= 3) return prev;
        return [...prev, { value: strength }];
      }
    });
  };

  // ✅ 다음 페이지 이동
  const onNextClick = () => {
    if (2 > selectedStrengths.length) {
      alert("최소 2개부터 3개까지 강점을 선택해주세요!");
      return;
    }
    resumeData.strengths = selectedStrengths;

    console.log("[Strengths] 최종 선택한 강점:", selectedStrengths); // ✅ 선택한 데이터 확인
    navigate("/branding-tone", { state: resumeData });
  };

  return (
    <div className="strengths-body">
      <ProgressSteps currentStep={currentStep} />

      <div className="strengths-container">
        <h2 className="strengths-title">일할 때의 내 모습을 골라주세요.</h2>
        <p className="sub-text">
          가장 나를 잘 표현하는 문장을 2-3개 선택해주세요.
        </p>

        <div className="strengths-list">
          {strengthsList.map((strength, index) => (
            <button
              key={index}
              className={`strength-item ${
                selectedStrengths.map((s) => s.value).includes(strength)
                  ? "selected"
                  : ""
              }`}
              onClick={() => handleStrengthSelect(strength)}
              disabled={
                selectedStrengths.length >= 3 &&
                !selectedStrengths.some((s) => s.value === strength)
              }
            >
              <img
                src={
                  selectedStrengths.map((s) => s.value).includes(strength)
                    ? checkWhiteIcon
                    : checkIcon
                }
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
