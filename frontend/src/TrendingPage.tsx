import React from "react";
import { Link } from "react-router-dom"; // Import the Link component for routing
import "./TrendingPage.css";
import logo from "./color_transparent.png"; // Import the logo image

// Define the type for a board
interface Board {
  id: string;
  title: string;
  author: string;
}

const TrendingPage: React.FC = () => {
  // This is just dummy data. Replace it with your actual data.
  const trendingBoards: Board[] = [
    { id: "1", title: "Board 1", author: "Author 1" },
    { id: "2", title: "Board 2", author: "Author 2" },
    { id: "3", title: "Board 3", author: "Author 3" },
    { id: "4", title: "Board 4", author: "Author 4" },
    { id: "5", title: "Board 5", author: "Author 5" },
    { id: "6", title: "Board 6", author: "Author 6" },
  ];

  return (
    <div className="trending-page">
      <Link to="/">
        <img src={logo} alt="Logo" id="logoIcon" />
      </Link>
      <section>
        <div className="Trendingcontent">
          <h1 data-text="Trending">Trending</h1>
          <div className="ContentContainer">
            {trendingBoards.map((board, index) => (
              // Render each board with its title and author

              <div className="Tboards" key={index}>
                <Link
                  className="link"
                  to={`/boards/${board.id}`}
                  key={board.id}
                >
                  <h2>{board.title}</h2>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="Trendingcontainer">
          <div className="circle">
            <span style={{ "--i": 1 } as React.CSSProperties}></span>
            <span style={{ "--i": 2 } as React.CSSProperties}></span>
            <span style={{ "--i": 3 } as React.CSSProperties}></span>
            <span style={{ "--i": 4 } as React.CSSProperties}></span>
            <span style={{ "--i": 5 } as React.CSSProperties}></span>
            <span style={{ "--i": 6 } as React.CSSProperties}></span>
            <span style={{ "--i": 7 } as React.CSSProperties}></span>
            <span style={{ "--i": 8 } as React.CSSProperties}></span>
            <span style={{ "--i": 9 } as React.CSSProperties}></span>
            <span style={{ "--i": 10 } as React.CSSProperties}></span>
            <span style={{ "--i": 11 } as React.CSSProperties}></span>
            <span style={{ "--i": 12 } as React.CSSProperties}></span>
            <span style={{ "--i": 13 } as React.CSSProperties}></span>
            <span style={{ "--i": 14 } as React.CSSProperties}></span>
            <span style={{ "--i": 15 } as React.CSSProperties}></span>
            <span style={{ "--i": 16 } as React.CSSProperties}></span>
            <span style={{ "--i": 17 } as React.CSSProperties}></span>
            <span style={{ "--i": 18 } as React.CSSProperties}></span>
            <span style={{ "--i": 19 } as React.CSSProperties}></span>
            <span style={{ "--i": 20 } as React.CSSProperties}></span>
          </div>
          <div className="circle">
            <span style={{ "--i": 1 } as React.CSSProperties}></span>
            <span style={{ "--i": 2 } as React.CSSProperties}></span>
            <span style={{ "--i": 3 } as React.CSSProperties}></span>
            <span style={{ "--i": 4 } as React.CSSProperties}></span>
            <span style={{ "--i": 5 } as React.CSSProperties}></span>
            <span style={{ "--i": 6 } as React.CSSProperties}></span>
            <span style={{ "--i": 7 } as React.CSSProperties}></span>
            <span style={{ "--i": 8 } as React.CSSProperties}></span>
            <span style={{ "--i": 9 } as React.CSSProperties}></span>
            <span style={{ "--i": 10 } as React.CSSProperties}></span>
            <span style={{ "--i": 11 } as React.CSSProperties}></span>
            <span style={{ "--i": 12 } as React.CSSProperties}></span>
            <span style={{ "--i": 13 } as React.CSSProperties}></span>
            <span style={{ "--i": 14 } as React.CSSProperties}></span>
            <span style={{ "--i": 15 } as React.CSSProperties}></span>
            <span style={{ "--i": 16 } as React.CSSProperties}></span>
            <span style={{ "--i": 17 } as React.CSSProperties}></span>
            <span style={{ "--i": 18 } as React.CSSProperties}></span>
            <span style={{ "--i": 19 } as React.CSSProperties}></span>
            <span style={{ "--i": 20 } as React.CSSProperties}></span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrendingPage;
