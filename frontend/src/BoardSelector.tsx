import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import the Link component for routing
import logo from "./color_transparent.png"; // Import the logo image
import "./BoardSelector.css";
import { useAuth0 } from "@auth0/auth0-react";

// Define the type for a board
interface Board {
  title: string;
  author: string;
  link: string;
}

const BoardSelector: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { logout, isLoading, isAuthenticated } = useAuth0();

  // Redirect if NOT logged in
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.replace("/");
    }
  }, [isAuthenticated, isLoading]);

  // Function to toggle the visibility of the menu
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // This is just dummy data. Replace it with your actual data.
  const recentlySeenBoards: Board[] = [
    { title: "Board 1", author: "Author 1", link: "" },
    { title: "Board 2", author: "Author 2", link: "" },
    { title: "Board 3", author: "Author 3", link: "" },
    { title: "Board 4", author: "Author 4", link: "" },
  ];

  const yourBoards: Board[] = [
    { title: "Board 5", author: "You", link: "" },
    { title: "Board 6", author: "You", link: "" },
    { title: "Board 7", author: "You", link: "" },
    { title: "Board 8", author: "You", link: "" },
    { title: "Board 9", author: "You", link: "" },
  ];

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
        <button className="new-board-button">Create New Board</button>
        <section className="recently-seen">
          <h2>Recently Seen</h2>
          {recentlySeenBoards.map((board, index) => (
            // Render each recently seen board with its title
            <Link
              to={`/board/${index}/${board.title}`}
              key={index}
              className="Bboard"
            >
              {board.title}
            </Link>
          ))}
        </section>
        <section className="your-boards">
          <h2>Your Boards</h2>
          {yourBoards.map((board, index) => (
            // Render each of your boards with its title
            <Link
              to={`/board/${index}/${board.title}`}
              key={index}
              className="Bboard"
            >
              {board.title}
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
};

export default BoardSelector;
