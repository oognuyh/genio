import React from "react";

import "./linkedinPreview.css"

const LinkedInPreview = ({ kitColor, tagline, position, hashtags }) => {
    return (
        <>
            <p className="linkedin-kit-standard">1584 x 396</p>
            <div className="linkedin-preview-container">
                <div className="linkedin-preview-kit"
                    style={{ background: `linear-gradient(to left, ${kitColor}, #ffffff 120%)` }}>
                    <div className="linkedin-preview-content">
                        <h1 className="linkedin-preview-title">
                            {tagline}
                        </h1>
                        <p className="linkedin-preview-role">
                            {position}
                        </p>
                    </div>
                    <div className="linkedin-preview-hashtag-list">
                        {hashtags.map((hashtag) => (
                            <div className="linkedin-preview-hashtag-chip" style={{ color: kitColor }}>{hashtag}</div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default LinkedInPreview;