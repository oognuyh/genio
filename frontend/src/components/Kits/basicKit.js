import React from "react";

import "../../styles/kitStyle.css";
import { lightenColor } from "../brandingCardBox";
import "./basicKit.css";

const BasicKit = ({ kitColor, tagline, biography, hashtags }) => {
  return (
    <div className="kit-hidden-container">
      <div
        id="branding-kit"
        className="basic-kit"
        style={{
          background: `linear-gradient(to left, ${kitColor}, ${kitColor},${lightenColor(
            kitColor,
            50
          )})`,
        }}
      >
        <div className="basic-kit-content">
          <h1 className="basic-kit-title">{tagline}</h1>
          <p className="basic-kit-description">{biography}</p>
        </div>
        <div className="basic-hashtag-list">
          {hashtags.map((hashtag, i) => (
            <div
              key={`basic-kit-hashtags__${i}`}
              className="basic-hashtag-chip"
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

export default BasicKit;
