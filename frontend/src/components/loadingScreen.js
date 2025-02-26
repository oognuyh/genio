import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import axios from "axios";

const LoadingScreen = () => {
    const navigate = useNavigate();

    // navigate를 통해 입장했을 때
    const location = useLocation();
    const [fileInfo, setFileInfo] = useState(location?.state);

    useEffect(() => {
        getResumeInfo();
    }, []);

    // 이력서 전송 API호출 및 분석 정보 받아오기
    const getResumeInfo = async () => {
        console.log(fileInfo);

        const resumeInfo = await axios.post("api/v1/resumes", fileInfo, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            }
        }).catch(err => {
            console.log(err);
        });

        console.log(resumeInfo.data);
        navigate("/resume-no", { state: resumeInfo.data });
    }

    return (
        <div className="container">
            <h1 className="big-text">로딩 중...</h1>
        </div>
    );
};

export default LoadingScreen;