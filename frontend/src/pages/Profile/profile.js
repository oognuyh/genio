import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./profile.css";
import ProgressSteps from "../../components/ProgressSteps";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentStep = 2;

  // LoadingScreen에서 넘긴 JSON
  const [resumeData, setResumeData] = useState(location?.state || {});
  const [selectedSkills, setSelectedSkills] = useState(resumeData.skillSet || []);

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    setResumeData({ ...resumeData, [e.target.name]: e.target.value });
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
    navigate("/strengths");
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
              <input type="text" name="position" value={resumeData.position || ""} onChange={handleChange} />
            </div>
            <div className="input-group title-group">
              <label>타이틀</label>
              <select name="experience" value={resumeData.experience || ""} onChange={handleChange}>
                <option value="취준생">취준생</option>
                <option value="신입">신입</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={`${i + 1}년차`}>{`${i + 1}년차`}</option>
                ))}
              </select>
              <input type="text" name="jobCategory" value={resumeData.jobCategory || ""} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>스킬</label>
              <div className="skills-container">
                {resumeData.skillSet?.map((skill) => (
                  <button
                    key={skill}
                    className={`skill-btn ${selectedSkills.includes(skill) ? "selected" : ""}`}
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
              <label>경험</label>
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
