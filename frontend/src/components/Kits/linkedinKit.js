import React from "react";

import "../../styles/kitStyle.css"
import "./linkedinKit.css"

const LinkedinKit = ({ kitColor, tagline, role, hashtags }) => {
    return (
        <div className="kit-hidden-container">
            <div id="branding-kit" className="linkedin-kit"
                style={{ background: `linear-gradient(to left, ${kitColor}, #ffffff 120%)` }}>
                <div className="linkedin-kit-content">
                    <h1 className="linkedin-kit-title">
                        {tagline}, <span className="name-highlight">이용우</span>
                    </h1>
                    <p className="linkedin-kit-role">
                        {role}
                    </p>
                </div>
                <div className="linkedin-hashtag-list">
                    {hashtags.map((hashtag) => (
                        <div className="linkedin-hashtag-chip" style={{ color: kitColor }}>#{hashtag}</div>
                    ))}
                </div>
            </div>
        </div >
    );
};

export default LinkedinKit;