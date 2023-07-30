import * as api from "./api";
import useDragScroll from "./useDragScroll";
import * as utils from "./utils";
import { IBoard, IHtmlPreviewWidget } from "../../backend/src/db";

import "./BoardPage.css";
import logo from "./color_transparent.png";

import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { CustomDrag } from "./CustomDrag";

interface ParamTypes {
  [key: string]: string | undefined;
}

const BoardPage: React.FC = () => {
  const { id } = useParams<ParamTypes>();
  const boardRef = useRef<HTMLDivElement>(null);
  // const [mode, setMode] = useState("drag"); // 'drag' or 'move'
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const [url, setUrl] = useState("");
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [boardData, setBoardData] = useState<IBoard | null>(null);
  const [boardTitle, setBoardTitle] = useState(boardData?.name || "New Title");
  const [isTitleEdited, setIsTitleEdited] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBoardTitle(e.target.value);
    setIsTitleEdited(e.target.value !== boardData?.name);
  };

  // Reset the state when the title is saved
  const handleTitleSave = async () => {
    const updateResult = await api.updateBoard(
      id!,
      { ...boardData!, name: boardTitle },
      await getAccessTokenSilently()
    );
    console.log("updateResult:", updateResult);
    setIsTitleEdited(false);
  };

  // Redirect if NOT logged in
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // window.location.replace("/");
      // alert('Please Log in first')
    }
  }, [isAuthenticated, isLoading]);

  const handleShare = () => {
    alert(`TODO: Not implemented`);
  };

  // const handleMouseDown = (e: React.MouseEvent) => {
  //   if (mode === "move") {
  //     onMouseDown(e);
  //   }
  // };

  // const handleMouseMove = (e: React.MouseEvent) => {
  //   if (mode === "move") {
  //     onMouseMove(e, boardRef);
  //   }
  // };

  const addWidget = async () => {
    // TODO: use new proxy when implemented
    const URLWithProxy = `${window.origin}/api/proxy?url=${encodeURIComponent(
      url
    )}`;
    const newBoardData = { ...boardData! };
    newBoardData.widgets.push({
      contentType: "htmlPreview",
      content: {
        URL: URLWithProxy,
        zoom: 0,
        scroll: { x: 0, y: 0 },
      },
      position: {
        x: 100,
        y: 100,
      },
      size: {
        width: 0,
        height: 0,
      },
    });

    setBoardData(newBoardData);

    // Update the board data on the server
    // TODO: verify correct update
    const updateResult = await api.updateBoard(
      id!,
      newBoardData,
      await getAccessTokenSilently()
    );
    console.log("updateResult:", updateResult);

    setUrl("");
  };

  // Fetch the board data from the server on startup
  useEffect(() => {
    const fetchBoard = async () => {
      if (!boardData) {
        const fetchedBoardData = await api.fetchBoard(
          id!,
          await getAccessTokenSilently()
        );
        setBoardData(fetchedBoardData);
      }
    };
    fetchBoard().catch(() => {
      // utils.redirectHome();
    });
  }, [boardData, id, getAccessTokenSilently]);

  useEffect(() => {
    if (boardData) {
      setBoardTitle(boardData.name);
    }
  }, [boardData]);

  return (
    <div className="Board-Page" style={{ width: "105%", overflow: "hidden" }} ref={scrollableContainerRef}>
      <div style={{ height: "175px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to="/boards">
            <img src={logo} alt="Logo" id="boardPagelogo" />
          </Link>
          <input
            type="text"
            value={boardTitle}
            onChange={handleTitleChange}
            required
            className="title-input"
          />
          {isTitleEdited && (
            <button className="btn save-button" onClick={handleTitleSave}>
              Save Title
            </button>
          )}
        </div>
        <div className="inputBox">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <span>Insert Url</span>
          <i></i>
        </div>

        <div className="container">
          <button className="btn btn1" onClick={addWidget}>
            Insert
          </button>
          <button className="btn btn2" onClick={handleShare}>
            Share
          </button>
        </div>
        <br />
        <br />
        <div className="Middle">
          {/* <button
            className="MoveDrag"
            onClick={() => setMode(mode === "drag" ? "move" : "drag")}
          >
            {mode === "drag" ? "Move Board" : "Drag Elements"}
          </button> */}
        </div>
      </div>

      <div
        className="whiteboard"
        ref={boardRef}
        // onMouseDown={handleMouseDown}
        // onMouseMove={handleMouseMove}
        // onMouseUp={onMouseUp}
        // onMouseLeave={onMouseUp} // Stop dragging when the mouse leaves the whiteboard
        onContextMenu={(e) => e.preventDefault()}
      >
        {!boardData ? (
          <div className="loadContainer">
            <div className="ring"></div>
            <div className="ring"></div>
            <div className="ring"></div>
            <span className="loadMessage">Loading...</span>
          </div>
        ) : (
          boardData.widgets.map((widget, i) => (
            <CustomDrag
              setPosition={(position) => {
                (async () => {
                  // Send position update to board
                  const newBoardData = { ...boardData };
                  newBoardData.widgets[i].position.x = position.x;
                  newBoardData.widgets[i].position.y = position.y;

                  // Check if the new position is near the border of the whiteboard

                  setBoardData(newBoardData);
                })();
              }}
              onEnd={async () => {
                // TODO: verify correct update
                const updateResult = await api.updateBoard(
                  id!,
                  boardData,
                  await getAccessTokenSilently()
                );
                console.log("Update result", updateResult);
              }}
              currentPosition={{ x: widget.position.x, y: widget.position.y }}
              className="draggable-element"
            >
              <iframe
                // TODO: support the other widgets
                src={(widget.content as IHtmlPreviewWidget).URL}
                title={`widget-${i}`}
                style={{
                  width: "calc(100% - 10px)",
                  height: "calc(100% - 50px)",
                  marginTop: "40px",
                }}
              />
              <button
                onClick={async () => {
                  const newBoardData = { ...boardData };
                  newBoardData.widgets.splice(i, 1);
                  setBoardData(newBoardData);

                  // Update the board data on the server
                  // TODO: verify update
                  const updateResult = await api.updateBoard(
                    id!,
                    newBoardData,
                    await getAccessTokenSilently()
                  );
                  console.log("updateResult:", updateResult);
                }}
              >
                Delete
              </button>
            </CustomDrag>
          ))
        )}
      </div>
    </div>
  );
};

export default BoardPage;
