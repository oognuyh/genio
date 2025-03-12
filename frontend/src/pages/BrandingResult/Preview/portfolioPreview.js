import React from "react";

import "./portfolioPreview.css"

const PortfolioPreview = ({ kitColor, tagline, hashtags }) => {
    return (
        <>
            <p className="portfolio-kit-standard">1920 x 1080</p>
            <div className="portfolio-preview-container">
                <div id="branding-preview-kit" className="portfolio-preview-kit"
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
                    <div className="portfolio-preview-contact-list">
                        <p className="portfolio-preview-contact-title">Contact</p>
                        <p className="portfolio-preview-url">https://www.example.com/</p>
                        <p className="portfolio-preview-tel">(+82) 10 XXXX XXXX</p>
                        <p className="portfolio-preview-email">example@example.com</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PortfolioPreview;