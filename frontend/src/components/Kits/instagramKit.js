import React, { useState } from "react";

import "../../styles/kitStyle.css"
import "./instagramKit.css"

const InstagramKit = ({ kitColor, tagline, description, hashtags }) => {
    return (
        <div className="kit-hidden-container">
            <div id="branding-kit" className="instagram-kit"
                style={{ background: `linear-gradient(to top, ${kitColor}, #ffffff 120%)` }}>
                <h1 className="instagram-kit-title">
                    {tagline}
                </h1>
                <div className="instagram-hashtag-list">
                    {hashtags.map((hashtag) => (
                        <div className="instagram-hashtag-chip" style={{ color: kitColor }}>#{hashtag}</div>
                    ))}
                </div>
                <p className="instagram-kit-description">
                    {description}
                </p>
            </div>
        </div >
    );
};

export default InstagramKit;