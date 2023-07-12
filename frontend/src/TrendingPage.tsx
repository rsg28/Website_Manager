import React from 'react';
import { Link } from 'react-router-dom'; // Import the Link component for routing
import './TrendingPage.css';
import logo from './color_transparent.png'; // Import the logo image

// Define the type for a board
interface Board {
  title: string;
  author: string;
}

const TrendingPage: React.FC = () => {
  // This is just dummy data. Replace it with your actual data.
  const trendingBoards: Board[] = [
    { title: 'Board 1', author: 'Author 1' },
    { title: 'Board 2', author: 'Author 2' },
    { title: 'Board 3', author: 'Author 3' },
    { title: 'Board 4', author: 'Author 4' },
    { title: 'Board 5', author: 'Author 5' },
    { title: 'Board 6', author: 'Author 6' },
    { title: 'Board 7', author: 'Author 7' },
    { title: 'Board 8', author: 'Author 8' },
  ];

  return (
    <div className="trending-page">
      <Link to="/"> {/* Link to the LandingPage */}
        <img src={logo} alt="Logo" id="logoIcon" /> {/* Logo image */}
      </Link>
      <h1>Trending Boards</h1>
      <div className="container">
        {trendingBoards.map((board, index) => (
          // Render each board with its title and author
          <div className="Tboards" key={index}>
            <h2>{board.title}</h2>
            <p className="Tauthor">{board.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingPage;