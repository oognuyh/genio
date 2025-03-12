import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import ProgressSteps from "../../components/progressSteps";

import "./profile.css";

/* =========================
   유효성 검사 관련 함수들
========================= */

/**
 * 부분 자모(초성/중성/종성) 검사 정규식
 * U+1100 ~ U+11FF 범위
 */
const partialJamoRegex = /[\u1100-\u11FF]/;

/**
 * 완성된 한글(가-힣)만 허용 (공백 가능)
 * ^[가-힣\s]+$
 */
const fullHangulRegex = /^[가-힣\s]+$/;

/**
 * 영문만 허용 (공백 가능)
 * ^[A-Za-z\s]+$
 */
const englishRegex = /^[A-Za-z\s]+$/;

/**
 * 한글 이름/position 유효성 검사:
 * 1) 부분 자모가 있으면 => "정자로 입력해주세요."
 * 2) 숫자, 영문, 특수문자 => "숫자, 영문, 특수문자는 입력할 수 없어요."
 */
function validateKoreanField(value) {
  if (!value.trim()) return ""; // 빈 값이면 별도 처리 X

  // 1) 부분 자모(초성/중성/종성) 검사
  if (partialJamoRegex.test(value)) {
    return "정자로 입력해주세요.";
  }

  // 2) 완성형 한글(공백 포함)만 허용
  if (!fullHangulRegex.test(value)) {
    return "숫자, 영문, 특수문자는 입력할 수 없어요.";
  }
  return "";
}

/**
 * 영문 이름 필드 유효성 검사:
 * 한글이 섞이면 => "영문만 입력해주세요."
 * (숫자/특수문자도 허용하지 않는다고 가정)
 */
function validateEnglishField(value) {
  if (!value.trim()) return ""; // 빈 값이면 별도 처리 X

  if (!englishRegex.test(value)) {
    return "영문만 입력해주세요.";
  }
  return "";
}

const Profile = () => {
  const currentStep = 2;

  const navigate = useNavigate();
  const location = useLocation();

  // LoadingScreen에서 넘긴 오브젝트
  const [resumeData, setResumeData] = useState(location.state || {});
  const [charCount, setCharCount] = useState(
    resumeData.experience?.length || 0
  );

  const [categoryInfo, setCategoryInfo] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [skillSet, setSkillSet] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState(
    resumeData.skillSet || []
  );
  const [isCategoryLoaded, setIsCategoryLoaded] = useState(false);

  // 직접 입력하기 여부 플래그
  const fromDirectInput = resumeData.fromDirectInput === true;

  // 유효성 검사 상태 (영문이름, stage 필드 추가)
  const [isValid, setIsValid] = useState({
    name: true,
    englishName: true,
    position: true,
    experience: true,
    stage: true,
  });

  // 각 필드별 에러 메시지 상태
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    englishName: "",
    position: "",
  });

  // 직접입력 모드 여부 (타이틀 select 대신 input 렌더링)
  const [isCustomStage, setIsCustomStage] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get("/api/v1/job-categories");
      const categories = response.data;

      setCategoryInfo(categories);
      setIsCategoryLoaded(true);

      const names = categories.map((category) => category.name);
      setJobCategories(names);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // resumeData 변경 시 모든 필드에 대해 유효성 검사 (englishName, stage 포함)
    const newValidity = {
      name: resumeData.name?.trim().length > 0 && !fieldErrors.name,
      englishName:
        resumeData.englishName?.trim().length > 0 && !fieldErrors.englishName,
      position: resumeData.position?.trim().length > 0 && !fieldErrors.position,
      experience:
        resumeData.experience?.trim().length > 0 &&
        resumeData.experience.trim().length <= 3000,
      stage: resumeData.stage?.trim().length > 0,
    };

    setIsValid(newValidity);

    if (resumeData.experience?.length > 0) {
      setCharCount(resumeData.experience.length);
    }
  }, [resumeData, fieldErrors]);

  useEffect(() => {
    if (!isCategoryLoaded || !resumeData.jobCategory) return;

    const selectedCategory = categoryInfo.find(
      (cat) => cat.name === resumeData.jobCategory
    );

    if (!selectedCategory) {
      setSkillSet([]);
      return;
    }

    const skills = selectedCategory.skillSet || [];
    setSkillSet(skills);

    // 기존 선택된 스킬 중 유효한 것만 필터링
    setSelectedSkills((prev) => prev.filter((skill) => skills.includes(skill)));
  }, [resumeData.jobCategory, categoryInfo, isCategoryLoaded]);

  // 입력 필드 값 변경 핸들러 (즉시 유효성 검사)
  const handleChange = (e) => {
    const { name, value } = e.target;
    let errorMsg = "";

    // 필드별로 별도 유효성 검사
    if (name === "name") {
      // 한글 이름 필드
      errorMsg = validateKoreanField(value);
      setFieldErrors((prev) => ({ ...prev, name: errorMsg }));
    } else if (name === "englishName") {
      // 영문 이름 필드
      errorMsg = validateEnglishField(value);
      setFieldErrors((prev) => ({ ...prev, englishName: errorMsg }));
    } else if (name === "position") {
      // position 필드도 한글만 허용
      errorMsg = validateKoreanField(value);
      setFieldErrors((prev) => ({ ...prev, position: errorMsg }));
    }

    if (name === "stage") {
      // stage 필드는 select와 input으로 나뉨
      if (e.target.tagName === "SELECT") {
        if (value === "custom") {
          setIsCustomStage(true);
          setResumeData((prev) => ({ ...prev, stage: "" }));
          setIsValid((prev) => ({ ...prev, stage: false }));
        } else {
          setIsCustomStage(false);
          setResumeData((prev) => ({ ...prev, stage: value }));
          setIsValid((prev) => ({ ...prev, stage: true }));
        }
      } else {
        // 직접입력 input인 경우
        setResumeData((prev) => ({ ...prev, stage: value }));
        setIsValid((prev) => ({ ...prev, stage: value.trim().length > 0 }));
      }
      return;
    } else if (name === "experience") {
      // 🔹 textarea 높이 자동 조절
      const textarea = e.target;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";

      setResumeData((prev) => {
        const updatedData = { ...prev, [name]: value };
        setCharCount(updatedData.experience.length); // 글자 수 업데이트
        return updatedData;
      });
    } else {
      // 일반 텍스트 필드
      setResumeData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 🔹 Ctrl+V(붙여넣기) 이벤트 추가
  const handlePaste = (e) => {
    e.preventDefault();

    const pastedText = e.clipboardData.getData("text");
    const textarea = e.target;
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;

    let newPastedText = "";

    setResumeData((prev) => {
      const currentText = prev.experience || "";
      const beforeCursor = currentText.substring(0, selectionStart);
      const afterCursor = currentText.substring(selectionEnd);

      const availableSpace = 3000 - currentText.length;
      newPastedText = pastedText.substring(0, availableSpace);

      const finalText = beforeCursor + newPastedText + afterCursor;

      return { ...prev, experience: finalText };
    });

    setTimeout(() => {
      setResumeData((prev) => {
        const updatedExperience = prev.experience || "";
        textarea.selectionStart = selectionStart + newPastedText.length;
        textarea.selectionEnd = selectionStart + newPastedText.length;
        setCharCount(updatedExperience.length); // 글자 수 업데이트
        return { ...prev, experience: updatedExperience };
      });
    }, 0);
  };

  // 스킬 선택 핸들러
  const toggleSkill = (skill) => {
    setSelectedSkills((prevSkills) =>
      prevSkills.includes(skill)
        ? prevSkills.filter((s) => s !== skill)
        : [...prevSkills, skill]
    );
  };

  // Ctrl+Z 및 Ctrl+C/V 허용
  const handleKeyDown = (e) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      ["z", "c", "v"].includes(e.key.toLowerCase())
    ) {
      return; // Ctrl+Z, Ctrl+C, Ctrl+V 허용
    }

    if (e.key === "Backspace" || e.key === "Delete") {
      return; // 지우기 키 허용
    }
  };

  const onNextClick = () => {
    if (charCount > 3000) return; // 3000자 초과 시 아무 동작 안 함

    resumeData.skillSet = selectedSkills;

    // 🔹 빈 필드 체크 + 에러 메시지 체크
    const newValidity = {
      name: resumeData.name?.trim().length > 0 && !fieldErrors.name,
      englishName:
        resumeData.englishName?.trim().length > 0 && !fieldErrors.englishName,
      position: resumeData.position?.trim().length > 0 && !fieldErrors.position,
      experience: resumeData.experience?.trim().length > 0,
      stage: resumeData.stage?.trim().length > 0,
    };

    setIsValid(newValidity);

    if (Object.values(newValidity).includes(false)) return;

    navigate("/strengths", { state: resumeData });
  };

  return (
    <div className="profile-body">
      <ProgressSteps currentStep={currentStep} />
      <div className="profile-container">
        {/* ++ 제목/부제목 조건부 렌더링 */}
        <h2 className="profile-title">
          {fromDirectInput ? "프로필을 입력해주세요." : "프로필이 완성됐어요!"}
        </h2>
        <p className="sub-text">
          {fromDirectInput ? (
            <>
              퍼스널 브랜딩 키트를 만들기 위해 프로필 정보가 필요해요. <br />각
              항목을 모두 입력하면 제니오가 자동으로 분석해 입력해드릴게요.
            </>
          ) : (
            <>
              내용이 정확한지 확인해주세요. <br />
              빠진 내용이 있거나 잘못된 정보가 있다면 각 항목을 직접 수정할 수
              있어요.
            </>
          )}
        </p>

        <div className="form-container">
          {/* 왼쪽 패널 */}
          <div className="left-panel">
            {/* 이름 + 영문이름 (double-input) */}
            <div className="input-group double-input">
              <label>이름</label>

              {/* 두 필드를 나란히 배치할 컨테이너 */}
              <div className="double-input-field">
                {/* 한글 이름 */}
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="name"
                    placeholder="한글이름"
                    value={resumeData.name || ""}
                    onChange={handleChange}
                    className={`${isValid.name ? "" : "invalid"}`}
                  />
                  {fieldErrors.name && (
                    <span className="error-message">{fieldErrors.name}</span>
                  )}
                </div>

                {/* 영문 이름 */}
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="englishName"
                    placeholder="영어이름"
                    value={resumeData.englishName || ""}
                    onChange={handleChange}
                    className={`${isValid.englishName ? "" : "invalid"}`}
                  />
                  {fieldErrors.englishName && (
                    <span className="error-message">
                      {fieldErrors.englishName}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 직군 */}
            <div className="input-group">
              <label>직군</label>
              <select
                name="jobCategory"
                placeholder="직군선택"
                value={resumeData.jobCategory || ""}
                onChange={handleChange}
              >
                {jobCategories.map((position, i) => (
                  <option key={i} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>

            {/* 타이틀 (stage + position) */}
            <div className="input-group title-group">
              <label>타이틀</label>
              {/* stage */}
              {isCustomStage ? (
                <input
                  type="text"
                  name="stage"
                  value={resumeData.stage || ""}
                  onChange={handleChange}
                  className={isValid.stage ? "" : "invalid"}
                />
              ) : (
                <select
                  name="stage"
                  placeholder="0년차"
                  value={resumeData.stage || ""}
                  onChange={handleChange}
                  className={isValid.stage ? "" : "invalid"}
                >
                  <option value="취준생">취준생</option>
                  <option value="신입">신입</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={`${i + 1}년차`}>
                      {`${i + 1}년차`}
                    </option>
                  ))}
                  <option value="custom">직접입력</option>
                </select>
              )}
              {/* position */}
              <div className="input-wrapper">
                <input
                  type="text"
                  name="position"
                  placeholder="타이틀 입력"
                  value={resumeData.position || ""}
                  onChange={handleChange}
                  className={`${isValid.position ? "" : "invalid"}`}
                />
                {/* 에러 메시지 */}
                {fieldErrors.position && (
                  <span className="error-message">{fieldErrors.position}</span>
                )}
              </div>
            </div>

            {/* 스킬 */}
            <div className="input-group">
              <label>스킬</label>
              <div className="skills-container">
                {skillSet.map((skill) => (
                  <button
                    key={skill}
                    className={`skill-btn ${
                      selectedSkills.includes(skill) ? "selected" : ""
                    }`}
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽 패널 */}
          <div className="right-panel">
            <div className="input-group">
              <label>주요 경험</label>
              <textarea
                name="experience"
                value={resumeData.experience || ""}
                placeholder="API 개발 및 서버 최적화
                            · 사용자 인증 및 결제 API 개발 주도, 응답 속도 30% 개선
                            · 서버 부하 테스트 수행 후 성능 최적화, 트래픽 처리량 2배 증가
                            서비스 출시 및 운영 경험
                            · 신규 웹 서비스 런칭 참여, 초기 사용자 피드백 반영으로 버그 발생률 40% 감소
                            · 출시 후 서비스 안정화 작업 및 장애 대응, 다운타임 99.9% 유지"
                onChange={handleChange}
                onPaste={handlePaste}
                className={isValid.experience ? "" : "invalid"}
              />
              <div className="char-count-container">
                {charCount >= 2800 && (
                  <span className="char-warning">
                    주요 경험은 최대 3,000자까지 작성 가능해요!
                  </span>
                )}
                <span className="char-count">{charCount}/3000</span>
              </div>
            </div>
          </div>
        </div>

        <button
          className={`next-btn${
            Object.values(isValid).every((valid) => valid) ? "" : "-disabled"
          }`}
          onClick={onNextClick}
          disabled={
            charCount > 3000 || !Object.values(isValid).every((valid) => valid)
          }
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default Profile;
