import { useCallback, useEffect, useRef, useState } from "react";

const getTextColorForBackground = (backgroundColor) => {
  const r = parseInt(backgroundColor.replace("#", "").substring(1, 3), 16);
  const g = parseInt(backgroundColor.replace("#", "").substring(3, 5), 16);
  const b = parseInt(backgroundColor.replace("#", "").substring(5, 7), 16);

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 190 ? "#000000" : "#ffffff";
};

export const lightenColor = (hex, percent) => {
  // 입력받은 HEX 코드에서 #를 제거하고 16진수로 변환
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  // 각 RGB 값을 percent만큼 밝게 (255에 가깝게) 조정
  r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
  g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
  b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));

  // 다시 HEX 코드로 변환 (각 값이 두 자리가 되도록 패딩)
  const rHex = r.toString(16).padStart(2, "0");
  const gHex = g.toString(16).padStart(2, "0");
  const bHex = b.toString(16).padStart(2, "0");

  return `#${rHex}${gHex}${bHex}`;
};

export const styles = {
  기본: {
    width: 915,
    height: 306,
    gradient: "left",
    tagline: {
      fontSize: "24px",
      fontWeight: 500,
      lineHeight: "140%",
      marginTop: "54px",
      marginLeft: "54px",
    },
    biography: {
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: "160%",
      marginTop: "16px",
      marginInline: "54px",
    },
    chips: {
      display: "flex",
      gap: "12px",
      marginTop: "41px",
      marginLeft: "54px",
    },
    chip: {
      fontSize: "12px",
      fontWeight: 700,
      background: "rgba(255, 255, 255, 0.8)",
      mixBlendMode: "screen",
      color: "black",
      borderRadius: "4px",
      padding: "4px 8px",
      display: "inline-block",
    },
    text: {},
  },
  링크드인: {
    width: 1584,
    height: 396,
    gradient: "left",
    tagline: {
      fontSize: "50px",
      fontWeight: 700,
      lineHeight: "140%",
      marginTop: "155px",
      marginInline: "54px",
      textAlign: "right",
    },
    chips: {
      display: "flex",
      gap: "12px",
      marginTop: "20px",
      marginInline: "54px",
      justifyContent: "end",
    },
    chip: {
      fontSize: "14px",
      fontWeight: 700,
      background: "rgba(255, 255, 255, 0.8)",
      mixBlendMode: "screen",
      color: "black",
      borderRadius: "4px",
      padding: "4px 8px",
      display: "inline-block",
    },
    text: {},
  },
  인스타그램: {
    width: 1080,
    height: 1080,
    gradient: "top",
    tagline: {
      fontSize: "68px",
      fontWeight: 700,
      lineHeight: "140%",
      marginTop: "390px",
      textAlign: "center",
      width: "100%",
    },
    chips: {
      display: "flex",
      gap: "16px",
      justifyContent: "center",
      marginTop: "48px",
      marginInline: "100px",
    },
    chip: {
      fontSize: "25px",
      fontWeight: 700,
      background: "rgba(255, 255, 255, 0.8)",
      mixBlendMode: "screen",
      color: "black",
      borderRadius: "8px",
      padding: "8px 12px",
      display: "inline-block",
    },
    text: {},
  },
  포트폴리오: {
    width: 1920,
    height: 1080,
    gradient: "right",
    tagline: {
      fontSize: "72px",
      fontWeight: "bold",
      lineHeight: "140%",
      textAlign: "left",
      width: "100%",
      marginTop: "72px",
      marginInline: "100px",
    },
    name: {
      marginTop: "8px",
      fontSize: "72px",
      fontWeight: "bold",
      lineHeight: "140%",
      marginInline: "100px",
    },
    chips: {
      display: "flex",
      gap: "16px",
      marginTop: "32px",
      marginInline: "100px",
    },
    chip: {
      fontSize: "24px",
      fontWeight: 700,
      background: "rgba(255, 255, 255, 0.8)",
      borderRadius: "8px",
      mixBlendMode: "screen",
      color: "black",
      padding: "4px 8px",
      display: "inline-block",
    },
    contact: {},
    text: {},
  },
};

export const EditableText = ({
  className,
  value,
  onChange,
  style,
  canEdit = true,
}) => {
  const divRef = useRef(null);

  useEffect(() => {
    if (value) {
      divRef.current.textContent = value;
    }
  }, [value]);

  return (
    <div
      ref={divRef}
      className={className}
      contentEditable={canEdit}
      suppressContentEditableWarning
      onInput={(e) => {
        onChange(divRef.current.textContent);
      }}
      style={{
        ...style,
        cursor: canEdit ? "text" : "default",
        display: "inline-block",
        whiteSpace: "pre-wrap",
        outline: "none",
      }}
    />
  );
};

export const BrandingCardBox = ({
  platform,
  kitColor,
  tagline,
  biography,
  hashtags,
  name,
  website,
  phone,
  email,
  onChange,
  fontFamily = "Pretendard",
}) => {
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);

  const calculateScale = useCallback(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const newScale = Math.min(1, containerWidth / styles[platform].width);

    setScale(newScale);
  }, [platform]);

  useEffect(() => {
    calculateScale();

    window.addEventListener("resize", calculateScale);

    return () => window.removeEventListener("resize", calculateScale);
  }, [calculateScale]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: `${styles[platform].width}px`,
        position: "relative",
        overflow: "hidden",
      }}
      ref={containerRef}
    >
      <div
        style={{
          aspectRatio: `${styles[platform].width} / ${styles[platform].height}`,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            id="branding-kit"
            style={{
              fontFamily: fontFamily,
              width: `${styles[platform].width}px`,
              height: `${styles[platform].height}px`,
              backgroundColor: kitColor || "#ffffff",
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              position: "absolute",
              color: getTextColorForBackground(kitColor),
              top: 0,
              left: 0,
              background: `linear-gradient(to left, ${kitColor},${lightenColor(
                kitColor,
                50
              )})`, // #ffffff 120%
            }}
          >
            {platform === "포트폴리오" && (
              <div
                style={{
                  fontSize: "56px",
                  fontWeight: "bold",
                  marginTop: "100px",
                  marginInline: "100px",
                }}
              >
                Portfolio
              </div>
            )}

            <EditableText
              style={styles[platform].tagline}
              value={tagline}
              onChange={(text) => onChange("tagline", text)}
            />

            {platform === "포트폴리오" && (
              <EditableText
                style={styles[platform].name}
                onChange={(text) => onChange("name", text)}
                value={name}
              />
            )}

            {styles[platform].biography && (
              <EditableText
                style={styles[platform].biography}
                value={biography}
              />
            )}

            <div style={styles[platform].chips}>
              {hashtags.map((tag, index) => (
                <div key={index} style={styles[platform].chip}>
                  {tag}
                </div>
              ))}
            </div>

            {platform === "포트폴리오" && (
              <div
                style={{
                  marginTop: "280px",
                  marginInline: "100px",
                }}
              >
                <div style={{ fontSize: "22px", fontWeight: 600 }}>Contact</div>

                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 400,
                    marginTop: "24px",
                    display: "flex",
                    gap: "8px",
                    flexDirection: "column",
                  }}
                >
                  <EditableText
                    value={website}
                    onChange={(text) => onChange("website", text)}
                  />
                  <EditableText
                    value={phone}
                    onChange={(text) => onChange("phone", text)}
                  />
                  <EditableText
                    value={email}
                    onChange={(text) => onChange("email", text)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
