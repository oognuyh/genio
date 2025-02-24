import React from "react";
import "./styles.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SplashScreen from "./components/SplashScreen";
import ResumeCheck from "./components/ResumeCheck";
import ResumeYes from "./components/ResumeYes";
import ResumeNo from "./components/ResumeNo";
import BrandingResult from './pages/BrandingResult/brandingResult';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/resume-check" element={<ResumeCheck />} />
        <Route path="/resume-yes" element={<ResumeYes />} />
        <Route path="/resume-no" element={<ResumeNo />} />
        <Route path="result" element={<BrandingResult />} />
      </Routes>
    </Router>
  );
}

export default App;
