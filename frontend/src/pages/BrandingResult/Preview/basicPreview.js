import React from "react";

import "./basicPreview.css"

const BasicPreview = ({ kitColor, tagline, description, hashtags }) => {
    return (
        <>
            <p className="basic-kit-standard">1020 x 306</p>
            <div className="basic-preview-container">
                <div className="basic-preview-kit"
                    style={{ background: `linear-gradient(to left, ${kitColor}, #ffffff 120%)` }}>
                    <div className="basic-preview-content">
                        <h1 className="basic-preview-title">
                            {tagline}, <span className="name-highlight">이용우</span>입니다.
                        </h1>
                        <p className="basic-preview-description">
                            {description}
                        </p>
                    </div>
                    <div className="basic-preview-hashtag-list">
                        {hashtags.map((hashtag) => (
                            <div className="basic-preview-hashtag-chip" style={{ color: kitColor }}>#{hashtag}</div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BasicPreview;