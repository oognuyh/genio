import React from "react";

import {
  EditableText,
  lightenColor,
} from "../../../components/brandingCardBox";
import "./instagramPreview.css";

const InstagramInPreview = ({
  kitColor,
  tagline,
  biography,
  hashtags,
  onChange,
}) => {
  return (
    <div>
      <p className="instagram-kit-standard">1080 x 1080</p>
      <div className="instagram-preview-container">
        <div
          id="branding-preview-kit"
          className="instagram-preview-kit"
          style={{
            background: `linear-gradient(to top, ${kitColor}, ${lightenColor(
              kitColor,
              50
            )})`,
          }}
        >
          <EditableText
            className="instagram-preview-title"
            value={tagline}
            onChange={(text) => onChange("tagline", text)}
          />
          <div className="instagram-preview-hashtag-list">
            {hashtags.map((hashtag, i) => (
              <EditableText
                key={`insta-hashtags__${i}`}
                className="instagram-preview-hashtag-chip"
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

export default InstagramInPreview;
