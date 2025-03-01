import React, { useState } from "react";

import "../../styles/kitStyle.css"
import "./basicKit.css"

const BasicKit = ({kitColor, tagline, biography, hashtags}) => {
    return (
        <div className="kit-hidden-container">
            <div id="branding-kit" className="basic-kit"
                style={{ background: `linear-gradient(to left, ${kitColor}, #ffffff 120%)` }}>
                <div className="basic-kit-content">
                    <h1 className="basic-kit-title">
                        {tagline}
                    </h1>
                    <p className="basic-kit-description">
                        {biography}
                    </p>
                </div>
                <div className="basic-hashtag-list">
                    {hashtags.map((hashtag) => (
                        <div className="basic-hashtag-chip" style={{color: kitColor}}>{hashtag}</div>
                    ))}
                </div>
            </div>
        </div >
    );
};

export default BasicKit;