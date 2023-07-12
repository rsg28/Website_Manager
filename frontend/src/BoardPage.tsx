import React, { useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./BoardPage.css";
import logo from "./color_transparent.png";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";
import useDragScroll from "./useDragScroll";

interface ParamTypes {
  [key: string]: string | undefined;
}

interface Block {
  id: number;
  position: number;
  left: number;
  title: string;
}

const BoardPage: React.FC = () => {
  const { id, title } = useParams<ParamTypes>();
  const boardTitle = title || "Unnamed";
  const boardRef = useRef<HTMLDivElement>(null);
  const { onMouseDown, onMouseMove, onMouseUp } = useDragScroll();
  const [mode, setMode] = useState("drag"); // 'drag' or 'move'
  const [blocks, setBlocks] = useState<Block[]>([]); // Array to keep track of blocks
  const [url, setUrl] = useState(""); // State to keep track of entered URL

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

  const addBlock = () => {
    setBlocks([
      {
        id: Date.now(),
        position: 0,
        left: blocks.length * 120,
        title:
          url.startsWith("http://") || url.startsWith("https://")
            ? url
            : `https://${url}`, // Use entered URL as the title
      },
      ...blocks,
    ]);
    setUrl(""); // Clear the textbox
  };

  const deleteBlock = (id: number) => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };

  return (
    <div className="Board-Page">
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/">
          <img src={logo} alt="Logo" id="logo" />
        </Link>
        <h1>{boardTitle}</h1>
      </div>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL"
      />
      <button onClick={addBlock}>Submit</button>
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
        {blocks.map((block, i) => (
          <Draggable
            key={block.id}
            onStart={handleDragStart}
            disabled={mode === "move"}
          >
            <div
              className="draggable-element"
              style={{ top: `${block.position}px`, left: `${block.left}px` }}
            >
              <iframe
                src={block.title}
                title={block.title}
                style={{ width: "100%", height: "100%" }}
              />
              <button onClick={() => deleteBlock(block.id)}>Delete</button>
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export default BoardPage;