import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import ProgressSteps from "../../components/ProgressSteps";

import "./profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentStep = 2;

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
    if (name === "experience" && value.length > 1000) return; // 최대 1000자 제한

    setResumeData({ ...resumeData, [name]: value });
    setCharCount(value.length);

    setIsValid((prev) => ({
      ...prev,
      [name]: value.trim().length > 0,
    }));
  };

  // 스킬 선택 핸들러
  const toggleSkill = (skill) => {
    setSelectedSkills((prevSkills) =>
      prevSkills.includes(skill)
        ? prevSkills.filter((s) => s !== skill)
        : [...prevSkills, skill]
    );
  };

  const onNextClick = () => {
    resumeData.skillSet = selectedSkills;

    // 빈 필드가 있는지 최종 체크 (페이지 이동 막음)
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
        <h2 className="profile-title">프로필 확인</h2>
        <p className="sub-text">
          분석된 정보를 확인하고 필요하다면 수정하세요.
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
                className={isValid.experience ? "" : "invalid"}
              />
              <div className="char-count-container">
                {charCount > 800 && (
                  <span className="char-warning">
                    주요 경험은 최대 1000자까지 작성 가능해요
                  </span>
                )}
                <span className="char-count">{charCount}/1000자</span>
              </div>
            </div>
          </div>
        </div>

        <button className="next-btn" onClick={onNextClick}>
          다음
        </button>
      </div>
    </div>
  );
};

export default Profile;
