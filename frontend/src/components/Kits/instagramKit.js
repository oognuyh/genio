import React from "react";

import "../../styles/kitStyle.css";
import { lightenColor } from "../brandingCardBox";
import "./instagramKit.css";

const InstagramKit = ({ kitColor, tagline, biography, hashtags }) => {
  return (
    <div className="kit-hidden-container">
      <div
        id="branding-kit"
        className="instagram-kit"
        style={{
          background: `linear-gradient(to top, ${kitColor}, ${kitColor},${lightenColor(
            kitColor,
            50
          )})`,
        }}
      >
        <h1 className="instagram-kit-title">{tagline}</h1>
        <div className="instagram-hashtag-list">
          {hashtags.map((hashtag, i) => (
            <div
              key={`insta-kit-hashtags__${i}`}
              className="instagram-hashtag-chip"
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

export default InstagramKit;
