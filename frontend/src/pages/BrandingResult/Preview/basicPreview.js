import React from "react";

import {
  EditableText,
  lightenColor,
} from "../../../components/brandingCardBox";
import "./basicPreview.css";

const BasicPreview = ({ kitColor, tagline, biography, hashtags, onChange }) => {
  return (
    <div>
      <p className="basic-kit-standard">1020 x 306</p>
      <div className="basic-preview-container">
        <div
          id="branding-preview-kit"
          className="basic-preview-kit"
          style={{
            background: `linear-gradient(to left, ${kitColor}, ${lightenColor(
              kitColor,
              50
            )})`,
          }}
        >
          <div className="basic-preview-content">
            <EditableText
              className="basic-preview-title"
              value={tagline}
              onChange={(text) => onChange("tagline", text)}
            />

            <EditableText
              className="basic-preview-description"
              value={biography}
              onChange={(text) => onChange("biography", text)}
            />
          </div>
          <div className="basic-preview-hashtag-list">
            {hashtags.map((hashtag, i) => (
              <EditableText
                key={`basic-hashtags__${i}`}
                className="basic-preview-hashtag-chip"
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

export default BasicPreview;
