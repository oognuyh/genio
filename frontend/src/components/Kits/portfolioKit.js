import React from "react";

import "../../styles/kitStyle.css";
import { lightenColor } from "../brandingCardBox";
import "./portfolioKit.css";

const PortfolioKit = ({ kitColor, tagline, hashtags }) => {
  return (
    <div className="kit-hidden-container">
      <div
        id="branding-kit"
        className="portfolio-kit"
        style={{
          background: `linear-gradient(to right, ${kitColor}, ${kitColor},${lightenColor(
            kitColor,
            50
          )})`,
        }}
      >
        <div className="portfolio-kit-intro">Portfolio</div>
        <h1 className="portfolio-kit-title">{tagline}</h1>
        <div className="portfolio-hashtag-list">
          {hashtags.map((hashtag, i) => (
            <div
              key={`portfolio-kit-hashtags__${i}`}
              className="portfolio-hashtag-chip"
              style={{ color: kitColor }}
            >
              {hashtag}
            </div>
          ))}
        </div>
        <div className="portfolio-kit-contact-list">
          <p className="portfolio-kit-contact-title">Contact</p>
          <p className="portfolio-kit-url">website url</p>
          <p className="portfolio-kit-tel">(+00) 000 0000 3137</p>
          <p className="portfolio-kit-email">email address</p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioKit;
