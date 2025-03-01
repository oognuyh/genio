import React, { useState } from "react";

import "../../styles/kitStyle.css"
import "./portfolioKit.css"

const PortfolioKit = ({ kitColor, tagline, hashtags }) => {
    return (
        <div className="kit-hidden-container">
            <div id="branding-kit" className="portfolio-kit"
                style={{ background: `linear-gradient(to right, ${kitColor}, #ffffff 120%)` }}>
                <div className="portfolio-kit-intro">Portfolio</div>
                <h1 className="portfolio-kit-title">
                    {tagline}
                </h1>
                <div className="portfolio-hashtag-list">
                    {hashtags.map((hashtag) => (
                        <div className="portfolio-hashtag-chip" style={{ color: kitColor }}>{hashtag}</div>
                    ))}
                </div>
            </div>
        </div >
    );
};

export default PortfolioKit;