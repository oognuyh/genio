import React, { useState, useEffect } from "react";
import ProgressSteps from "../../components/ProgressSteps";
import "./profile.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const currentStep = 2; // 현재 단계 (프로필 확인)

  // 초기 상태
  const [profileData, setProfileData] = useState({
    name: "",
    job: "",
    experience: "",
    title: "",
    description: "",
    skills: [],
  });

  const allSkills = [
    "AWS", "Java", "Python", "React", "JavaScript",
    "Git", "TypeScript", "CSS", "HTML", "Spring",
    "Node.js", "Next.js", "MySQL", "Docker",
    "Kubernetes", "Linux", "Vue", "Kotlin", "SQL"
  ];

  // 📌 백엔드에서 이력서 정보 불러오기
  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await axios.get("/api/v1/resume");
        console.log("이력서 데이터:", response.data);

        setProfileData({
          name: response.data.name || "",
          job: response.data.job || "",
          experience: response.data.experience || "",
          title: response.data.title || "",
          description: response.data.description || "",
          skills: response.data.skills || [],
        });
      } catch (error) {
        console.error("이력서 데이터를 불러오는 중 오류 발생:", error);
      }
    };

    fetchResumeData();
  }, []);

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const onNextClick = () => {
    navigate("/strengths");
  };

  // 스킬 선택/해제 기능
  const handleSkillToggle = (skill) => {
    setProfileData((prev) => {
      const skills = prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill) // 선택 해제
        : [...prev.skills, skill]; // 선택 추가
      return { ...prev, skills };
    });
  };

  return (
    <div className="profile-body">
      <ProgressSteps currentStep={currentStep} />
      <div className="profile-container">
        <h2>용우님의 프로필을 빠르게 완성했어요.</h2>
        <p className="sub-text">
          프로필이 빠짐없이 잘 작성되었는지 확인해주세요.<br />
          제니오가 분석한 정보가 잘못되었다면 수정할 수 있어요.
        </p>

        <div className="form-container">
          {/* 🔹 왼쪽 패널 (이름, 직군, 타이틀, 스킬셋) */}
          <div className="left-panel">

            <div className="input-group">
              <label>이름</label>
              <input
                type="text"
                name="name"
                placeholder="이용우"
                value={profileData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <label>직군</label>
              <select name="job" value={profileData.job} onChange={handleInputChange}>
                <option>개발자</option>
                <option>데이터 분석가</option>
                <option>기획자</option>
                <option>마케터</option>
              </select>
            </div>

            <div className="input-group">
              <label>타이틀</label>
              <div className="title-container">
                <select name="experience" value={profileData.experience} onChange={handleInputChange}>
                  <option>취준생</option>
                  <option>신입</option>
                  <option>1년차</option>
                  <option>2년차</option>
                  <option>3년차</option>
                  <option>4년차</option>
                  <option>5년차</option>
                </select>
                <input
                  type="text"
                  name="title"
                  placeholder="예: 풀스택 개발자"
                  value={profileData.title}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label>스킬셋</label>
              <div className="skills-container">
                {allSkills.map((skill) => (
                  <button
                    key={skill}
                    className={`skill-btn ${profileData.skills.includes(skill) ? "selected" : ""}`}
                    onClick={() => handleSkillToggle(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 🔹 오른쪽 패널 (주요 경험) */}
          <div className="right-panel">
            <div className="input-group">
              <label>주요 경험</label>
              <textarea
                name="description"
                value={profileData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <button className="next-btn" onClick={onNextClick}>다음</button>
      </div>
    </div>
  );
};

export default Profile;
