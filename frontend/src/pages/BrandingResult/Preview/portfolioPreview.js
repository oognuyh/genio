import React from "react";

import "./portfolioPreview.css"

const PortfolioPreview = ({ kitColor, description, hashtags }) => {
    return (
        <div className="portfolio-preview-container">
            <div className="portfolio-preview-kit"
                style={{ background: `linear-gradient(to left, ${kitColor}, #ffffff 120%)` }}>
                <div className="portfolio-preview-content">
                    <h1 className="portfolio-preview-title">
                        코드 속에 삶을 담는 개발자, <span className="name-highlight">이용우</span>입니다.
                    </h1>
                    <p className="portfolio-preview-description">
                        {description}
                    </p>
                </div>
                <div className="portfolio-preview-hashtag-list">
                    {hashtags.map((hashtag) => (
                        <div className="portfolio-preview-hashtag-chip" style={{color: kitColor}}>{hashtag}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BasicPreview;