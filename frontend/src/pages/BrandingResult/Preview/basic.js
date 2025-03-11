import React, { useEffect, useState } from "react";

const Preview = ({ kitColor, tagline, biography, hashtags }) => {
  const [scale, setScale] = useState(1);
  const containerRef = React.useRef(null);

  // 원본 카드 크기
  const originalWidth = 1020;
  const originalHeight = 306;

  // 비율 계산 함수
  const calculateScale = () => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const newScale = Math.min(1, containerWidth / originalWidth);

    setScale(newScale);
  };

  // 리사이즈 이벤트 리스너 설정
  useEffect(() => {
    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, []);

  // 기본 스타일
  const styles = {
    container: {
      width: "100%",
      maxWidth: `${originalWidth}px`,
      position: "relative",
      overflow: "hidden",
    },
    aspectRatioBox: {
      aspectRatio: `${originalWidth} / ${originalHeight}`,
      position: "relative",
    },
    cardWrapper: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    card: {
      width: `${originalWidth}px`,
      height: `${originalHeight}px`,
      backgroundColor: kitColor || "#ffffff",
      transform: `scale(${scale})`,
      transformOrigin: "top left",
      position: "absolute",
      top: 0,
      left: 0,
      background: `linear-gradient(to left, ${kitColor}, #ffffff 120%)`,
    },
    tagline: {
      fontSize: `${24}px`,
      fontWeight: 500,
      lineHeight: "140%",
      marginBottom: "12px",
    },
    biography: {
      color: "#171717",
      fontSize: `${16}px`,
      fontWeight: 400,
      lineHeight: "160%",
      marginBottom: "16px",
    },
    text: {
      fontSize: `${14}px`,
      marginBottom: "16px",
    },
    chipContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
    },
    chip: {
      fontSize: `${12}px`,
      fontWeight: 600,
      background: "rgba(255, 255, 255, 0.8)",
      borderRadius: "4px",
      padding: "4px 8px",
      display: "inline-block",
    },
  };

  return (
    <div style={styles.container} ref={containerRef}>
      <div style={styles.aspectRatioBox}>
        <div style={styles.cardWrapper}>
          <div id="branding-kit" style={styles.card}>
            {tagline && <div style={styles.tagline}>{tagline}</div>}
            {biography && <div style={styles.biography}>{biography}</div>}

            <div style={styles.chipContainer}>
              {hashtags.map((tag, index) => (
                <div key={index} style={styles.chip}>
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
