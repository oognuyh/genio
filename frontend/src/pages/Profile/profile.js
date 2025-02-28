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
  const [resumeData, setResumeData] = useState(location?.state || {});

  const [categoryInfo, setCategoryInfo] = useState([]);

  const [jobCategories, setjobCategories] = useState([]);
  const [skillSet, setSkillSet] = useState([]);

  const [selectedSkills, setSelectedSkills] = useState(resumeData.skillSet || []);

  const [isCategoryLoaded, setIsCategoryLoaded] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get('/api/v1/job-categories');
      const categories = response.data;

      setCategoryInfo(categories);
      setIsCategoryLoaded(true); // ✅ 로딩 완료

      const names = categories.map(category => category.name);
      setjobCategories(names); // 상태 업데이트 트리거
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!isCategoryLoaded || !resumeData.jobCategory) return;

    const selectedCategory = categoryInfo.find(
      cat => cat.name === resumeData.jobCategory
    );

    if (!selectedCategory) {
      setSkillSet([]);
      return;
    }

    const skills = selectedCategory.skillSet || [];
    setSkillSet(skills);

    // 기존 선택된 스킬 중 유효한 것만 필터링
    setSelectedSkills(prev => prev.filter(skill => skills.includes(skill)));
  }, [resumeData.jobCategory, categoryInfo, isCategoryLoaded]); // ✅ 의존성 추가

  const getcategoryInfo = async () => {
    const response = await axios.get("/api/v1/job-categories");
    const categories = response.data;

    setCategoryInfo(categories);

    const names = categories.map(category => category.name);
    setjobCategories(names); // 상태 업데이트 트리거
  }

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    setResumeData({ ...resumeData, [e.target.name]: e.target.value });
  };

  // 스킬 선택 핸들러
  const toggleSkill = (skill) => {
    console.log(selectedSkills);

    setSelectedSkills((prevSkills) =>
      prevSkills.includes(skill)
        ? prevSkills.filter((s) => s !== skill)
        : [...prevSkills, skill]
    );
  };

  const onNextClick = () => {
    resumeData.skillSet = selectedSkills;
    console.log(resumeData)
    
    navigate("/strengths", { state: resumeData });
  };

  return (
    <div className="profile-body">
      <ProgressSteps currentStep={currentStep} />
      <div className="profile-container">
        <h2 className="profile-title">프로필 확인</h2>
        <p className="sub-text">분석된 정보를 확인하고 필요하다면 수정하세요.</p>

        <div className="form-container">
          {/* 왼쪽 패널 */}
          <div className="left-panel">
            <div className="input-group">
              <label>이름</label>
              <input type="text" name="name" value={resumeData.name || ""} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>직군</label>
              <select name="jobCategory" value={resumeData.jobCategory || ""} onChange={handleChange}>
                {jobCategories.map((position, i) => (
                  // ✅ 화살표 함수의 암시적 반환 사용 (소괄호)
                  <option key={i} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group title-group">
              <label>타이틀</label>
              <select name="stage" value={resumeData.stage || ""} onChange={handleChange}>
                <option value="취준생">취준생</option>
                <option value="신입">신입</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={`${i + 1}년차`}>{`${i + 1}년차`}</option>
                ))}
              </select>
              <input type="text" name="position" value={resumeData.position || ""} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>스킬</label>
              <div className="skills-container">
                {skillSet.map((skill) => (
                  <button
                    key={skill}
                    className={`skill-btn ${selectedSkills.includes(skill) ? 'selected' : ''}`}
                    onClick={() => toggleSkill(skill)}>
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
              <textarea name="experience" value={resumeData.experience || ""} onChange={handleChange} />
            </div>
          </div>
        </div>

        <button className="next-btn" onClick={onNextClick}>다음</button>
      </div>
    </div>
  );
};

export default Profile;