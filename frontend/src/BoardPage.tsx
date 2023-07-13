import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./BoardPage.css";
import logo from "./color_transparent.png";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";
import useDragScroll from "./useDragScroll";
import { useAuth0 } from "@auth0/auth0-react";

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
  const { title } = useParams<ParamTypes>();
  const boardTitle = title || "Unnamed";
  const boardRef = useRef<HTMLDivElement>(null);
  const { onMouseDown, onMouseMove, onMouseUp } = useDragScroll();
  const [mode, setMode] = useState("drag"); // 'drag' or 'move'
  const [blocks, setBlocks] = useState<Block[]>([]); // Array to keep track of blocks
  const [url, setUrl] = useState(""); // State to keep track of entered URL
  const { isLoading, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.replace("/");
    }
  }, [isAuthenticated, isLoading]);

  const handleShare = () => {
    alert(`TODO: Not implemented`);
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
    // TODO: use new proxy when implemented
    const URLWithProxy = `${window.origin}/api/proxy?url=${encodeURIComponent(url)}`;
    console.log(URLWithProxy);
    setBlocks([
      {
        id: Date.now(),
        position: 0,
        left: blocks.length * 120,
        title: URLWithProxy
      },
      ...blocks,
    ]);
    setUrl(""); 
  };

  const deleteBlock = (id: number) => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };

  return (
    <div className="Board-Page" style={{width: "100vw", height: "100vh", overflow: "hidden"}}>
      <div style={{height: "175px"}}>
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
      </div>

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
                style={{ width: "calc(100% - 10px)", height: "calc(100% - 50px)", marginTop: "40px"}}
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
