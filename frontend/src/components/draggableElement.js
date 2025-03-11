import { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import "./draggableElement.css";

export const DraggableElement = ({
  className,
  initialSize,
  initialPosition,
  boundary,
  children,
  onTextChange,
  ...props
}) => {
  const [state, setState] = useState({
    ...(initialSize || {}),
    ...(initialPosition || {}),
  });

  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(children);
  const textareaRef = useRef(null);

  // textarea 높이 자동 조정
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      // 먼저 높이를 auto로 설정하여 내용에 맞게 확장
      textareaRef.current.style.height = "auto";
      // 그런 다음 실제 스크롤 높이로 설정
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing, text]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (onTextChange) {
      onTextChange(e.target.value);
    }
  };

  useEffect(() => {}, [state.x, state.y]);

  const handleEditComplete = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Enter만 누르면 제출 (Shift+Enter는 줄바꿈)
      handleEditComplete();
    }
  };

  return (
    <Rnd
      className={`draggable-element${className ? " " + className : ""}`}
      bounds={boundary}
      dragGrid={[10, 10]}
      size={{
        width: state.width,
        height: state.height,
      }}
      position={{
        x: state.x,
        y: state.y,
      }}
      onDragStop={(e, d) => {
        setState({ ...state, x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setState({
          ...state,
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          ...position,
        });
      }}
      disableDragging={isEditing}
      enableResizing={!isEditing}
      {...props}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onBlur={handleEditComplete}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            resize: "none",
            outline: "none",
            backgroundColor: "transparent",
            fontFamily: "inherit",
            fontSize: "inherit",
            color: "inherit",
            padding: "0",
            margin: "0",
            overflow: "auto", // hidden 대신 auto 사용
            boxSizing: "border-box",
            lineHeight: "normal",
          }}
        />
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          style={{
            width: "100%",
            height: "100%",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflow: "hidden", // 편집 모드가 아닐 때는 overflow hidden 유지
            textOverflow: "ellipsis",
            boxSizing: "border-box",
          }}
        >
          {text}
        </div>
      )}
    </Rnd>
  );
};
