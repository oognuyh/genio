import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen/splashScreen";
import ResumeCheck from "./pages/ResumeCheck/resumeCheck";
import ResumeUpload from "./pages/ResumeUpload/resumeUpload";
import ResumeNo from "./components/ResumeNo";
import BrandingResult from "./pages/BrandingResult/brandingResult";
import LoadingScreen from "./components/loadingScreen";
import Profile from "./pages/Profile/profile";
import Strengths from "./pages/Strengths/strengths";
import BrandingTone from "./pages/BrandingTone/brandingTone";
import Loading2 from "./components/loading2"

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
        <Route path="/profile" element={<Profile />} />
        <Route path="/strengths" element={<Strengths />} />
        <Route path="/branding-tone" element={<BrandingTone />} />
        <Route path="/loading2" element={<Loading2 />} />
      </Routes>
    </Router>
  );
}

export default App;
