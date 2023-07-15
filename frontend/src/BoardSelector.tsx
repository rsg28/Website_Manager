import * as api from "./api";
import {BoardMetadata} from "../../backend/src/routes/boards";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import the Link component for routing
import logo from "./color_transparent.png"; // Import the logo image
import "./BoardSelector.css";
import { useAuth0 } from "@auth0/auth0-react";


const BoardSelector: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { logout, isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [metadata, setMetadata] = useState<BoardMetadata[] | null>(null);

  // Redirect if NOT logged in
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.replace("/");
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

  // Function to toggle the visibility of the menu
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="board-selector">
      <Link to="/trending">
        <div className="trending-message">Browse trending ➡</div>
      </Link>
      <button className="menu-button" onClick={toggleMenu}>
        ☰
      </button>
      <div className={`sidebar ${showMenu ? "show" : ""}`}>
        <div className="app-info">
          <img src={logo} alt="Logo" id="logoIcon" /> {/* Logo image */}
          <h1>Storm-Board</h1>
        </div>
        <button className="logout-button" onClick={() => logout({
          openUrl(url) {
            const redirectURL = `${url}&returnTo=${encodeURIComponent(window.location.origin)}`;
            window.location.replace(redirectURL);
          }
        }) 
        }>Logout</button>
      </div>
      <main id="boardSelector">
        
        <button className="new-board-button" onClick={async () => {
          const accessToken = await getAccessTokenSilently();
          if (!accessToken) {
            return;
          }

          const boardName = `New Board - ${new Date().toLocaleString()}`;

          const newBoardId = await api.createNewBoard(boardName, accessToken);
          window.location.replace(`/boards/${newBoardId}`);
        }}>Create New Board</button>

        {
          metadata !== null && metadata.length === 0 ? <h2 style={{color: "#FFFFFF"}}>You have no boards. Click "Create New Board" to start.</h2> 
          : <>
            <section className="recently-seen">
              <h2>Recently Seen</h2>
              {metadata === null ? <h2>Loading...</h2> : metadata.map((board, index) => {
                  // Render each recently seen board with its title
                  return <Link
                    to={`/boards/${board.id}`}
                    key={index}
                    className="Bboard"
                  >
                    {board.name}
                  </Link>  
                }
              )}
            </section>
            <section className="your-boards">
              <h2>Your Boards</h2>
              {metadata === null ? <h2>Loading...</h2> : metadata.map((board, index) => {
                  // Render each recently seen board with its title
                  return <Link
                    to={`/boards/${board.id}`}
                    key={index}
                    className="Bboard"
                  >
                    {board.name}
                  </Link>  
                }
              )}
            </section>
          </>
        }

       
      </main>
    </div>
  );
};

export default BoardSelector;
