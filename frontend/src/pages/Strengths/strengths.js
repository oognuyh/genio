import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 네비게이션 추가
import ProgressSteps from "../../components/ProgressSteps";
import "./strengths.css";

const Strengths = () => {
  const navigate = useNavigate(); // ✅ useNavigate 훅 사용
  const currentStep = 3; // ✅ 현재 진행단계 3단계

  // ✅ 강점 선택 상태 관리
  const [selectedStrengths, setSelectedStrengths] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // 🚀 선택 제한 안내 메시지 추가

  // ✅ 강점 선택 핸들러
  const handleStrengthSelect = (strength) => {
    if (selectedStrengths.includes(strength)) {
      // 이미 선택된 경우 해제
      setSelectedStrengths(selectedStrengths.filter((s) => s !== strength));
      setErrorMessage(""); // 🚀 제한 메시지 초기화
    } else if (selectedStrengths.length < 3) {
      // 최대 3개까지만 선택 가능
      setSelectedStrengths([...selectedStrengths, strength]);
      setErrorMessage(""); // 🚀 제한 메시지 초기화
    } else {
    }
  };

  // ✅ 다음 페이지 이동
  const onNextClick = () => {
    if (selectedStrengths.length === 0) {
      alert("최소 하나 이상의 강점을 선택해주세요!");
      return;
    }
    navigate("/branding-tone"); // 다음 페이지로 이동 (예: 브랜드 톤 선택 페이지)
  };

  // ✅ 선택 가능한 강점 리스트
  const strengthsList = [
    "작은 실수도 놓치지 않고 세세한 부분까지 확인해요.",
    "함께 의견을 나누며 일할 때 더 좋은 결과를 만들어요.",
    "문제가 생기면 끝까지 해결하려고 깊이 파고들어요.",
    "맡은 일을 끝내지 못하면 밤에 잠이 오지 않아요.",
    "일을 한 번 시작하면 시간 가는 줄 모르고 집중해요.",
    "동료나 상대방 입장에서 늘 생각하려고 노력해요.",
    "기타1",
    "기타2",
    "기타3",
    "기타4"
  ];

  return (
    <div className="strengths-body">
      <ProgressSteps currentStep={currentStep} />

      <div className="strengths-container">
        <h2 className="strengths-title">용우님은 일할 때 어떤 모습이세요?</h2>
        <p className="sub-text">용우님이 일할 때의 모습과 가장 가깝다고 생각하는 문장을 2~3개 골라주세요.</p>

        {/* 🚀 선택 제한 메시지 표시 */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="strengths-list">
          {strengthsList.map((strength, index) => (
            <button
              key={index}
              className={`strength-item ${selectedStrengths.includes(strength) ? "selected" : ""}`}
              onClick={() => handleStrengthSelect(strength)}
            >
              {strength}
            </button>
          ))}
        </div>

        {/* ✅ 3개 선택했을 때만 버튼 표시 */}
        {selectedStrengths.length === 3 && (
          <button className="st-next-btn" onClick={onNextClick}>다음</button>
        )}
      </div>
    </div>
  );
};

export default Strengths;
