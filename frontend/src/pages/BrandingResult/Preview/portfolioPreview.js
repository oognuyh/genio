import React from "react";

import "./portfolioPreview.css"

const PortfolioPreview = ({ kitColor, tagline, hashtags }) => {
    return (
        <>
            <p className="portfolio-kit-standard">1920 x 1080</p>
            <div className="portfolio-preview-container">
                <div className="portfolio-preview-kit"
                    style={{ background: `linear-gradient(to right, ${kitColor}, #ffffff 120%)` }}>
                    <div className="portfolio-preview-intro">Portfolio</div>
                    <h1 className="portfolio-preview-title">
                        {tagline}
                    </h1>
                    <div className="portfolio-preview-hashtag-list">
                        {hashtags.map((hashtag) => (
                            <div className="portfolio-preview-hashtag-chip" style={{ color: kitColor }}>{hashtag}</div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PortfolioPreview;