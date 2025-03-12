import React from "react";

import {
  EditableText,
  lightenColor,
} from "../../../components/brandingCardBox";
import "./portfolioPreview.css";

const PortfolioPreview = ({
  kitColor,
  tagline,
  hashtags,
  website,
  phone,
  email,
  onChange,
}) => {
  return (
    <>
      <p className="portfolio-kit-standard">1920 x 1080</p>
      <div className="portfolio-preview-container">
        <div
          id="branding-preview-kit"
          className="portfolio-preview-kit"
          style={{
            background: `linear-gradient(to right, ${kitColor}, ${lightenColor(
              kitColor,
              50
            )})`,
          }}
        >
          <div className="portfolio-preview-intro">Portfolio</div>
          <EditableText
            className="portfolio-preview-title"
            value={tagline}
            onChange={(text) => onChange(`tagline`, text)}
          />
          <div className="portfolio-preview-hashtag-list">
            {hashtags.map((hashtag, i) => (
              <EditableText
                key={`portfolio-hashtags__${i}`}
                className="portfolio-preview-hashtag-chip"
                style={{ color: kitColor }}
                value={hashtag}
                onChange={(text) => onChange(`hashtags:${i}`, text)}
              />
            ))}
          </div>
          <div className="portfolio-preview-contact-list">
            <p className="portfolio-preview-contact-title">Contact</p>
            <EditableText
              className="portfolio-preview-url"
              value={website}
              onChange={(text) => onChange(`website`, text)}
            />
            <EditableText
              className="portfolio-preview-tel"
              value={phone}
              onChange={(text) => onChange(`phone`, text)}
            />
            <EditableText
              className="portfolio-preview-email"
              value={email}
              onChange={(text) => onChange(`email`, text)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PortfolioPreview;
