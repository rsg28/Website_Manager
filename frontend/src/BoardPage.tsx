import React, { useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./BoardPage.css";
import logo from "./color_transparent.png";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";
import useDragScroll from "./useDragScroll";

interface ParamTypes {
  [key: string]: string | undefined;
}

const BoardPage: React.FC = () => {
  const { id, title } = useParams<ParamTypes>();
  const boardTitle = title || "Unnamed";
  const boardRef = useRef<HTMLDivElement>(null);
  const { onMouseDown, onMouseMove, onMouseUp } = useDragScroll();
  const [mode, setMode] = useState("drag"); // 'drag' or 'move'

  const handleShare = () => {
    alert(`Sharing ${boardTitle}`);
  };

  const handleDragStart = (e: DraggableEvent, data: DraggableData) => {
    e.stopPropagation();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode === "move") {
      onMouseDown(e);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mode === "move") {
      onMouseMove(e, boardRef);
    }
  };

  return (
    <div className="Board-Page">
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/">
          <img src={logo} alt="Logo" id="logo" />
        </Link>
        <h1>{boardTitle}</h1>
      </div>
      <button onClick={handleShare}>Share</button>
      <br />
      <br />
      <button onClick={() => setMode(mode === "drag" ? "move" : "drag")}>
        {mode === "drag" ? "Move Board" : "Drag Elements"}
      </button>
      <div
        className="whiteboard"
        ref={boardRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={onMouseUp}
        onContextMenu={(e) => e.preventDefault()}
      >
        {Array(50)
          .fill(null)
          .map((_, i) => (
            <Draggable
              key={i}
              onStart={handleDragStart}
              disabled={mode === "move"}
            >
              <div
                className="draggable-element"
                style={{ top: `${i * 120}px`, left: `${i * 120}px` }}
              >
                Element {i + 1}
              </div>
            </Draggable>
          ))}
      </div>
    </div>
  );
};

export default BoardPage;