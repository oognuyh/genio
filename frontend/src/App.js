import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { FileProvider } from "./contexts/FileContext";

import LoadingScreen from "./components/loadingScreen";
import BrandingResult from "./pages/BrandingResult/brandingResult";
import BrandingTone from "./pages/BrandingTone/brandingTone";
import Profile from "./pages/Profile/profile";
import ResumeCheck from "./pages/ResumeCheck/resumeCheck";
import ResumeUpload from "./pages/ResumeUpload/resumeUpload";
import SplashScreen from "./pages/SplashScreen/splashScreen";
import Strengths from "./pages/Strengths/strengths";

import CustomSection from "./components/customSection";

function App() {
  return (
    <FileProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/resume-check" element={<ResumeCheck />} />
          <Route path="/resume-upload" element={<ResumeUpload />} />
          <Route path="/branding-result" element={<BrandingResult />} />
          <Route path="/loading-screen" element={<LoadingScreen />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/strengths" element={<Strengths />} />
          <Route path="/branding-tone" element={<BrandingTone />} />
          <Route path="/custom" element={<CustomSection />} />
        </Routes>
      </Router>
    </FileProvider>
  );
}

export default App;
