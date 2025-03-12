import React from "react";

import "../../styles/kitStyle.css";
import { lightenColor } from "../brandingCardBox";
import "./linkedinKit.css";

const LinkedinKit = ({ kitColor, tagline, position, hashtags }) => {
  return (
    <div className="kit-hidden-container">
      <div
        id="branding-kit"
        className="linkedin-kit"
        style={{
          background: `linear-gradient(to left, ${kitColor}, ${kitColor},${lightenColor(
            kitColor,
            50
          )})`,
        }}
      >
        <div className="linkedin-kit-content">
          <h1 className="linkedin-kit-title">{tagline}</h1>
          <p className="linkedin-kit-role">{/*position*/}</p>
        </div>
        <div className="linkedin-hashtag-list">
          {hashtags.map((hashtag, i) => (
            <div
              key={`linked-kit-hashtags__${i}`}
              className="linkedin-hashtag-chip"
              style={{ color: kitColor }}
            >
              {hashtag}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LinkedinKit;
