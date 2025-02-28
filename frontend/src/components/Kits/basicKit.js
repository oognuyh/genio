import React, { useState } from "react";

import "../../styles/kitStyle.css"
import "./basicKit.css"

const BasicKit = ({kitColor, tagline, description, hashtags}) => {
    return (
        <div className="kit-hidden-container">
            <div id="branding-kit" className="basic-kit"
                style={{ background: `linear-gradient(to left, ${kitColor}, #ffffff 120%)` }}>
                <div className="basic-kit-content">
                    <h1 className="basic-kit-title">
                        {tagline}, <span className="name-highlight">이용우</span>입니다.
                    </h1>
                    <p className="basic-kit-description">
                        {description}
                    </p>
                </div>
                <div className="basic-hashtag-list">
                    {hashtags.map((hashtag) => (
                        <div className="basic-hashtag-chip" style={{color: kitColor}}>#{hashtag}</div>
                    ))}
                </div>
            </div>
        </div >
    );
};

export default BasicKit;