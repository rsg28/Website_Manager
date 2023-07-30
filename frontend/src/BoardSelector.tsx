import * as api from "./api";
import { BoardMetadata } from "../../backend/src/routes/boards";
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "./color_transparent.png";
import "./BoardSelector.css";
import { useAuth0 } from "@auth0/auth0-react";

const BoardSelector: React.FC = () => {
  const { logout, isLoading, isAuthenticated, getAccessTokenSilently } =
    useAuth0();
  const [metadata, setMetadata] = useState<BoardMetadata[] | null>(null);
  const newBoardButtonRef = useRef(null);
  const recentlySeenRef = useRef<HTMLDivElement>(null);
  const yourBoardsRef = useRef<HTMLDivElement>(null);
  const [buttonTopMargin, setButtonTopMargin] = useState(0);
  const [trendingTopMargin, setTrendingTopMargin] = useState(0);

  // Manage Positions
  const adjustButtonPosition = () => {
    const recentlySeenHeight = recentlySeenRef.current?.offsetHeight || 0;
    const yourBoardsHeight = yourBoardsRef.current?.offsetHeight || 0;
    const maxHeight = Math.max(recentlySeenHeight, yourBoardsHeight);
    if (maxHeight > 343) {
      setButtonTopMargin(maxHeight - 218);
    } else {
      setButtonTopMargin(150);
    }
  };

  const [yourBoardsTopMargin, setYourBoardsTopMargin] = useState(0); // Add this line

  const adjustMyBoardsPosition = () => {
    const recentlySeenHeight = recentlySeenRef.current?.offsetHeight || 0;
    const yourBoardsHeight = yourBoardsRef.current?.offsetHeight || 0;
    const maxHeight = Math.max(recentlySeenHeight, yourBoardsHeight);
    if (maxHeight > 355) {
      setYourBoardsTopMargin(maxHeight + 108); //Adjust this line (future possible erorr)
    } else {
      setYourBoardsTopMargin(0);
    }
  };

  const adjustTrendingPosition = () => {
    const yourBoardsHeight = yourBoardsRef.current?.offsetHeight || 0;
    const yourBoardsMargin = 620; // Replace with the actual margin
    setTrendingTopMargin(yourBoardsHeight + yourBoardsMargin + 50);
  };

  useEffect(() => {
    adjustTrendingPosition();
  }, [metadata]);

  useEffect(() => {
    adjustMyBoardsPosition();
  }, [metadata]); // Add this useEffect hook

  useEffect(() => {
    adjustButtonPosition();
  }, [metadata]);
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // window.location.replace("/");
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (metadata !== null) {
        return;
      }

      const accessToken = await getAccessTokenSilently();
      if (!accessToken) {
        return;
      }

      const fetchedMetadata = await api.getBoardMetadata(accessToken);
      setMetadata(fetchedMetadata);
    };

    fetchMetadata();
  }, [metadata, getAccessTokenSilently]);

  const deleteBoard = async (boardId: string) => {
    //Write a function to delete the board
  };
  useEffect(() => {
    adjustButtonPosition();
  }, [metadata]);

  return (
    <div className="board-selector">
      <h2 className="trending-message" style={{ marginTop: trendingTopMargin }}>
        <Link to="/trending" className="Link">
          Browse trending ➡
        </Link>
      </h2>

      <div className="app-info">
        <Link to="/">
          <img src={logo} alt="Logo" id="logoIcon" /> {/* Logo image */}
        </Link>
      </div>
      <button
        className="logout-button"
        onClick={() =>
          logout({
            openUrl(url) {
              const redirectURL = `${url}&returnTo=${encodeURIComponent(
                window.location.origin
              )}`;
              window.location.replace(redirectURL);
            },
          })
        }
      >
        Logout
      </button>
      <main id="boardSelector">
        <button
          className="new-board-button"
          style={{ marginTop: buttonTopMargin }}
          ref={newBoardButtonRef}
          onClick={async () => {
            const accessToken = await getAccessTokenSilently();
            if (!accessToken) {
              return;
            }

            const boardName = `New Board - ${new Date().toLocaleString()}`;

            const newBoardId = await api.createNewBoard(boardName, accessToken);
            window.location.replace(`/boards/${newBoardId}`);
          }}
        >
          Create New Board
        </button>

        {metadata !== null && metadata.length === 0 ? (
          <h2 style={{ color: "#FFFFFF" }}>
            You have no boards. Click "Create New Board" to start.
          </h2>
        ) : (
          <>
            <section className="recently-seen" ref={recentlySeenRef}>
              <h2>Recently Seen</h2>
              {metadata === null ? (
                <div className="loadContainer">
                  <div className="ring"></div>
                  <div className="ring"></div>
                  <div className="ring"></div>
                  <span className="loadMessage">Loading...</span>
                </div>
              ) : (
                metadata.map((board, index) => {
                  return (
                    <div key={index} className="Bboard">
                      <Link to={`/boards/${board.id}`}>{board.name}</Link>
                      <button onClick={() => deleteBoard(board.id)}>
                        Delete
                      </button>
                    </div>
                  );
                })
              )}
            </section>
            <section
              className="your-boards"
              style={{ marginTop: yourBoardsTopMargin }}
              ref={yourBoardsRef}
            >
              <h2>Your Boards</h2>
              {metadata === null ? (
                <div className="loadContainer">
                  <div className="ring"></div>
                  <div className="ring"></div>
                  <div className="ring"></div>
                  <span className="loadMessage">Loading...</span>
                </div>
              ) : (
                metadata.map((board, index) => {
                  return (
                    <div key={index} className="Bboard">
                      <Link to={`/boards/${board.id}`}>{board.name}</Link>
                      <button onClick={() => deleteBoard(board.id)}>
                        Delete
                      </button>
                    </div>
                  );
                })
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default BoardSelector;
