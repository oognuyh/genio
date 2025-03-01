import loadingImage1 from "../assets/loading1.png";
import loadingImage2 from "../assets/loading2.png";

import "./loadingScreen.css";

const LoadingScreen = ({ currentStep, message }) => {

  return (
    <div className="loading2-body"> 
      <p className="loading2-text" > { currentStep === 1 ? '제니오가 매의 눈으로 이력서를 살펴보고 있어요. 👀' : '제니오가 맞춤형 브랜딩 키트를 만들고 있어요. 🛠' } </p>
      <p className="loading2-subtext"> { message } </p>
      <img src={currentStep === 1 ? loadingImage1 : loadingImage2} alt="로딩 중" className="loading-image1" />
    </div>
  );
};

export default LoadingScreen;