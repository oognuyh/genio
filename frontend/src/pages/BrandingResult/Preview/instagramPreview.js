import React from "react";

import "./instagramPreview.css"

const InstagramInPreview = ({ kitColor, tagline, description, hashtags }) => {
    return (
        <>
            <p className="instagram-kit-standard">1080 x 1080</p>
            <div className="instagram-preview-container">
                <div className="instagram-preview-kit"
                    style={{ background: `linear-gradient(to top, ${kitColor}, #ffffff 120%)` }}>
                    <h1 className="instagram-preview-title">
                        {tagline}
                    </h1>
                    <div className="instagram-preview-hashtag-list">
                        {hashtags.map((hashtag) => (
                            <div className="instagram-preview-hashtag-chip" style={{ color: kitColor }}>#{hashtag}</div>
                        ))}
                    </div>
                    <p className="instagram-preview-description">
                        {description}
                    </p>
                </div>
            </div>
        </>
    );
};

export default InstagramInPreview;