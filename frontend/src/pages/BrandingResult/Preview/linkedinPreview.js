import React from "react";

import {
  EditableText,
  lightenColor,
} from "../../../components/brandingCardBox";
import "./linkedinPreview.css";

const LinkedInPreview = ({
  kitColor,
  tagline,
  position,
  hashtags,
  onChange,
}) => {
  return (
    <div>
      <p className="linkedin-kit-standard">1584 x 396</p>
      <div className="linkedin-preview-container">
        <div
          id="branding-preview-kit"
          className="linkedin-preview-kit"
          style={{
            background: `linear-gradient(to left, ${kitColor},${lightenColor(
              kitColor,
              50
            )})`,
          }}
        >
          <div className="linkedin-preview-content">
            <EditableText
              className="linkedin-preview-title"
              value={tagline}
              onChange={(text) => onChange(`tagline`, text)}
            />
          </div>
          <div className="linkedin-preview-hashtag-list">
            {hashtags.map((hashtag, i) => (
              <EditableText
                key={`linked-hashtags__${i}`}
                className="linkedin-preview-hashtag-chip"
                style={{ color: kitColor }}
                value={hashtag}
                onChange={(text) => onChange(`hashtags:${i}`, text)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInPreview;
