import React, { useState } from "react";

import templateIcon from "../assets/template-icon.png";
import colorPickerIcon from "../assets/colorpicker-icon.png";
import typoIcon from "../assets/typo-icon.png";
import customCloseImage from "../assets/popup-close.png";

import "./customSection.css";

const CustomSection = ({ platforms, colors, kitColor, kitPlatform, kitTypo, setKitPlatform, setKitColor, setKitTypo, setIsShifted }) => {
    const icons = [
        templateIcon,
        colorPickerIcon,
        typoIcon
    ];

    const titles = [
        "템플릿",
        "색상 팔레트",
        "타이포그래피"
    ];

    const typos = [
        {
            name: "프리텐다드",
            font: "Pretendard"
        },
        {
            name: "노토 산스",
            font: "Noto Sans KR"
        },
        {
            name: "나눔스퀘어",
            font: "nanumsquare"
        },
        {
            name: "에스코어 드림",
            font: "sCoreDream"
        },
        // {
        //     name: "Roboto",
        //     font: "Roboto"
        // },
        // {
        //     name: "Open Sans",
        //     font: "Open Sans"
        // },
        // {
        //     name: "Poppins",
        //     font: "Poppins"
        // },
        // {
        //     name: "Lora",
        //     font: "Lora"
        // }
    ];

    const [isCustomViewOpen, setIsCustomViewOpen] = useState(true); // 커스텀 영역 표출 플래그

    const [customTitle, setCustomTitle] = useState(titles[0]); // 커스텀 타이틀

    const [titleIdx, setTitleIdx] = useState(0); // 선택된 타이틀 인덱스

    const onClickIcon = (selectedIdx) => {
        const title = titles[selectedIdx];

        setCustomTitle(title);
        setTitleIdx(selectedIdx);
        setIsCustomViewOpen(true);
        setIsShifted(false);
    };

    const onClickClose = () => {
        setTitleIdx(-1);
        setIsCustomViewOpen(false);
        setIsShifted(true);
    };

    return (
        <div className="custom-container">
            <div className="custom-icon-wrapper">
                {icons.map((icon, index) => (
                    <img className={`custom-icon ${index === titleIdx ? "active" : ""}`} src={icon}
                        onClick={() => onClickIcon(index)} />
                ))}
            </div>
            <div className={`custom-list-wrapper ${isCustomViewOpen ? "active" : ""}`}>
                <div className="custom-title-wrapper">
                    <p className="custom-title">{customTitle}</p>
                    <button className="custom-close-button"
                        onClick={onClickClose}>
                        <img src={customCloseImage} width="20px" height="20px" alt="close" />
                    </button>
                </div>
                {/* 플랫폼 선택 리스트 */}
                <div className={`platform-list-wrapper ${titleIdx === 0 ? "active" : ""}`}>
                    {platforms.map((platform) => (
                        <p className={`platform-item ${platform === kitPlatform ? "active" : ""}`}
                            onClick={() => setKitPlatform(platform)}
                        >
                            {platform}
                        </p>
                    ))}
                </div>
                {/* 컬러 선택 리스트 */}
                <div className={`color-list-wrapper ${titleIdx === 1 ? "active" : ""}`}>
                    {colors.map((color) => (
                        <div
                            className={`color-item ${color === kitColor ? "active" : ""}`}
                            style={{
                                background: `linear-gradient(to left, ${color}, #ffffff 140%)`,
                            }}
                            onClick={() => setKitColor(color)}
                        />
                    ))}
                </div>
                {/* 타이포 선택 리스트 */}
                <div className={`typo-list-wrapper ${titleIdx === 2 ? "active" : ""}`}>
                    {typos.map((typo) => (
                        <p className={`typo-item ${typo.font === kitTypo ? "active" : ""}`}
                            data-visible={typo.font === kitTypo ? "true" : "false"}
                            onClick={() => setKitTypo(typo.font)}>
                            {typo.name}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CustomSection;
