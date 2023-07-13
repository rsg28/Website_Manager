import * as api from "./api";
import useDragScroll from "./useDragScroll";
import * as utils from "./utils";
import { IBoard, IHtmlPreviewWidget } from "../../backend/src/db";

import "./BoardPage.css";
import logo from "./color_transparent.png";

import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";
import { useAuth0 } from "@auth0/auth0-react";

interface ParamTypes {
  [key: string]: string | undefined;
}

const BoardPage: React.FC = () => {
  const { id } = useParams<ParamTypes>();
  const boardRef = useRef<HTMLDivElement>(null);
  const { onMouseDown, onMouseMove, onMouseUp } = useDragScroll();
  const [mode, setMode] = useState("drag"); // 'drag' or 'move'
  const [url, setUrl] = useState("");
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [boardData, setBoardData] = useState<IBoard | null>(null);

  // Redirect if NOT logged in
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

  const addWidget = async () => {
    // TODO: use new proxy when implemented
    const URLWithProxy = `${window.origin}/api/proxy?url=${encodeURIComponent(url)}`;
    const newBoardData = {...boardData!};
    newBoardData.widgets.push({
      contentType: "htmlPreview",
      content: {
        URL: URLWithProxy,
        zoom: 0,
        scroll: {x: 0, y: 0}
      },
      position: {
        x: 100,
        y: 100
      },
      size: {
        width: 0,
        height: 0
      }
    });
    
    setBoardData(newBoardData);

    // Update the board data on the server
    // TODO: verify correct update
    const updateResult = await api.updateBoard(id!, newBoardData, await getAccessTokenSilently());
    console.log("updateResult:", updateResult);
    
    setUrl("");
  };

  // Fetch the board data from the server on startup
  useEffect(() => {
    const fetchBoard = async () => {
      if(!boardData) {
        const fetchedBoardData = await api.fetchBoard(id!, await getAccessTokenSilently() );
        setBoardData(fetchedBoardData);
        console.log("boardDataIs:", fetchedBoardData);
      }
    };
    fetchBoard().catch(() => {
      utils.redirectHome();
    });
  }, [boardData, id, getAccessTokenSilently]);

  return (
    <div className="Board-Page" style={{width: "100vw", height: "100vh", overflow: "hidden"}}>
      <div style={{height: "175px"}}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to="/boards">
            <img src={logo} alt="Logo" id="logo" />
          </Link>
          <h1>{boardData?.name}</h1>
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
        />
        <button onClick={addWidget}>Submit</button>
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
        {
          !boardData ? <div>Loading...</div> : boardData.widgets.map((widget, i) => (
            <Draggable
              key={`widget-${i}`}
              onStart={handleDragStart}
              onStop={(e, data)  => {
                (async () => {
                  console.log(data);
                  console.log(boardData);
                  // Send position update to board
  
                  const newBoardData = {...boardData};
                  newBoardData.widgets[i].position.x = data.x;
                  newBoardData.widgets[i].position.y = data.y;
                  
                  // Update the board data on the server
                  // TODO: verify correct update
                  console.log("update", i, newBoardData.widgets[i].position.x, newBoardData.widgets[i].position.y);
                  const updateResult = await api.updateBoard(id!, newBoardData, await getAccessTokenSilently());
                  setBoardData(newBoardData);
                  console.log("Update result", updateResult);
                })();
              }}
              disabled={mode === "move"}
            >
              <div
                className="draggable-element"
                style={{ top: `${widget.position.y}px`, left: `${widget.position.x}px` }}
              >
                <iframe
                  // TODO: support the other widgets
                  src={(widget.content as IHtmlPreviewWidget).URL} 
                  title={`widget-${i}`}
                  style={{ width: "calc(100% - 10px)", height: "calc(100% - 50px)", marginTop: "40px"}}
                />
                <button onClick={async () => {
                  const newBoardData = {...boardData};
                  newBoardData.widgets.splice(i, 1);
                  setBoardData(newBoardData);

                  // Update the board data on the server
                  // TODO: verify update
                  const updateResult = await api.updateBoard(id!, newBoardData, await getAccessTokenSilently());
                  console.log("updateResult:", updateResult);
                }}>Delete</button>
              </div>
            </Draggable>
          ))
        }
      </div>
    </div>
  );
};

export default BoardPage;
