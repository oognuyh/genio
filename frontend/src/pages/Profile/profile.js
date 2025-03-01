import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import ProgressSteps from "../../components/ProgressSteps";

import "./profile.css";

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

  // 유효성 검사 상태
  const [isValid, setIsValid] = useState({
    name: true,
    position: true,
    experience: true,
  });

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

    if (name === "experience") {
      if (value.length > 1000) return; // 🔹 1000자 제한

      // 🔹 textarea 높이 자동 조절
      const textarea = e.target;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";

      setResumeData((prev) => {
        const updatedData = { ...prev, [name]: value };
        setCharCount(updatedData.experience.length); // 🔹 글자 수 업데이트
        return updatedData;
      });
    } else {
      setResumeData((prev) => ({ ...prev, [name]: value }));
    }

    setIsValid((prev) => ({
      ...prev,
      [name]: value.trim().length > 0,
    }));
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

      const availableSpace = 1000 - currentText.length;
      newPastedText = pastedText.substring(0, availableSpace);

      const finalText = beforeCursor + newPastedText + afterCursor;

      return { ...prev, experience: finalText };
    });

    setTimeout(() => {
      setResumeData((prev) => {
        const updatedExperience = prev.experience || "";
        textarea.selectionStart = selectionStart + newPastedText.length;
        textarea.selectionEnd = selectionStart + newPastedText.length;
        setCharCount(updatedExperience.length); // 🔹 글자 수 업데이트
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
    if (charCount > 1000) return; // 🔹 1000자 초과 시 아무 동작 안 함

    resumeData.skillSet = selectedSkills;

    // 🔹 빈 필드 체크
    const newValidity = {
      name: resumeData.name?.trim().length > 0,
      position: resumeData.position?.trim().length > 0,
      experience: resumeData.experience?.trim().length > 0,
    };

    setIsValid(newValidity);

    if (Object.values(newValidity).includes(false)) return;

    navigate("/strengths", { state: resumeData });
  };

  return (
    <div className="profile-body">
      <ProgressSteps currentStep={currentStep} />
      <div className="profile-container">
        <h2 className="profile-title">프로필이 완성됐어요!</h2>
        <p className="sub-text">
          내용이 정확한지 확인해주세요. <br />
          빠진 내용이 있거나 잘못된 정보가 있다면 각 항목을 직접 수정할 수
          있어요.
        </p>

        <div className="form-container">
          {/* 왼쪽 패널 */}
          <div className="left-panel">
            <div className="input-group">
              <label>이름</label>
              <input
                type="text"
                name="name"
                value={resumeData.name || ""}
                onChange={handleChange}
                className={isValid.name ? "" : "invalid"}
              />
            </div>
            <div className="input-group">
              <label>직군</label>
              <select
                name="jobCategory"
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
            <div className="input-group title-group">
              <label>타이틀</label>
              <select
                name="stage"
                value={resumeData.stage || ""}
                onChange={handleChange}
              >
                <option value="취준생">취준생</option>
                <option value="신입">신입</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={`${i + 1}년차`}>{`${
                    i + 1
                  }년차`}</option>
                ))}
              </select>
              <input
                type="text"
                name="position"
                value={resumeData.position || ""}
                onChange={handleChange}
                className={isValid.position ? "" : "invalid"}
              />
            </div>
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
                onChange={handleChange}
                onPaste={handlePaste}
                className={isValid.experience ? "" : "invalid"}
              />
              <div className="char-count-container">
                {charCount >= 1000 && (
                  <span className="char-warning">
                    주요 경험은 최대 1,000자까지 작성 가능해요!
                  </span>
                )}
                <span className="char-count">{charCount}/1000자</span>
              </div>
            </div>
          </div>
        </div>

        <button
          className="next-btn"
          onClick={onNextClick}
          disabled={charCount > 1000}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default Profile;
