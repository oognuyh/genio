import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen/splashScreen";
import ResumeCheck from "./pages/ResumeCheck/resumeCheck";
import ResumeUpload from "./pages/ResumeUpload/resumeUpload";
import ResumeNo from "./components/ResumeNo";
import BrandingResult from "./pages/BrandingResult/brandingResult";
import LoadingScreen from "./components/loadingScreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/resume-check" element={<ResumeCheck />} />
        <Route path="/resume-upload" element={<ResumeUpload />} />
        <Route path="/resume-no" element={<ResumeNo />} />
        <Route path="/branding-result" element={<BrandingResult />} />
        <Route path="/loading-screen" element={<LoadingScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
