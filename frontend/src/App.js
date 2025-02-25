import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen/splashScreen";
import ResumeCheck from "./pages/ResumeCheck/resumeCheck";
import ResumeUpload from "./pages/ResumeUpload/resumeUpload";
import ResumeNo from "./components/ResumeNo";
import BrandingResult from './pages/BrandingResult/brandingResult';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/resume-check" element={<ResumeCheck />} />
        <Route path="/resume-upload" element={<ResumeUpload />} />
        <Route path="/resume-no" element={<ResumeNo />} />
        <Route path="result" element={<BrandingResult />} />
      </Routes>
    </Router>
  );
}

export default App;
