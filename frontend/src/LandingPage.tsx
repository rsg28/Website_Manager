import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import logo from "./color_transparent.png";
import { useAuth0 } from "@auth0/auth0-react";

const LandingPage: React.FC = () => {
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const trendingBoardsRef = useRef<HTMLDivElement>(null);
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  // Redirect if logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      window.location.replace("/board");
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          } else {
            entry.target.classList.remove("show");
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    if (descriptionRef.current) observer.observe(descriptionRef.current);
    if (trendingBoardsRef.current) observer.observe(trendingBoardsRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="landing-page">
      <div id="menuIcon">
        <img src={logo} alt="Logo" id="logoIcon" />
      </div>
      <main>
        <h1>Storm-Board</h1>
        <p ref={descriptionRef}>
          Unleash the storm of creativity. Organize your web universe in a
          whirlwind of figures.
        </p>
        <div className="button-container">
          <div className="button-box">
            <button className="signin-button" onClick={() => loginWithRedirect()}>Sign in </button>
            <button className="signup-button">Sign up</button>
          </div>
        </div>
      </main>
      <div className="trending-boards" ref={trendingBoardsRef}>
        <h2 className="Subtitle">Trending Boards</h2>
        <div className="board-container">
          <div className="board">
            <h2>Board Title</h2>
            <p className="author">Author Name</p>
          </div>
          <div className="board">
            <h2>Board Title</h2>
            <p className="author">Author Name</p>
          </div>
          <div className="board">
            <h2>Board Title</h2>
            <p className="author">Author Name</p>
          </div>
          <div className="board">
            <h2>Board Title</h2>
            <p className="author">Author Name</p>
          </div>
        </div>
        <button className="see-more">
          <Link to="/trending">See More</Link>
        </button>
      </div>
    </div>
  );
};

export default LandingPage;