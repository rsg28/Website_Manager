import React, { useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import logo from "./color_transparent.png";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const boards = [
  { id: "1", title: "Board Title 1", author: "Author Name 1" },
  { id: "2", title: "Board Title 2", author: "Author Name 2" },
  { id: "3", title: "Board Title 3", author: "Author Name 3" },
];

const LandingPage: React.FC = () => {
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const trendingBoardsRef = useRef<HTMLDivElement>(null);
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      window.location.replace("/boards");
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
        <div className="stars"></div>
        <div className="twinkling"></div>
        <div className="clouds"></div>
        <div className="title">
          <h1>Storm-Board</h1>
          <p ref={descriptionRef}>Unleash the storm of creativity</p>

          <div className="button-container">
            <div className="button-box">
              <button
                className="signin-button"
                onClick={() => loginWithRedirect()}
              >
                Sign in
              </button>
              <button
                className="signup-button"
                onClick={() => loginWithRedirect()}
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </main>
      <div className="trending-boards" ref={trendingBoardsRef}>
        <h2 className="trending-title">Trending</h2>
        <div className="grid-container">
          {boards.map((board) => (
            <Link className="link" to={`/boards/${board.id}`} key={board.id}>
              <div className="grid-item" key={board.id}>
                <span className="boardTitle">{board.title}</span>
              </div>
            </Link>
          ))}
        </div>

        <button className="see-more-button">
          <Link to="/trending" className="link">See More</Link>
        </button>

        {/* <div className="container">
          <div className="particles">
            <span style={{ "--i": 11 } as React.CSSProperties}></span>
            <span style={{ "--i": 12 } as React.CSSProperties}></span>
            <span style={{ "--i": 24 } as React.CSSProperties}></span>
            <span style={{ "--i": 10 } as React.CSSProperties}></span>
            <span style={{ "--i": 14 } as React.CSSProperties}></span>
            <span style={{ "--i": 23 } as React.CSSProperties}></span>
            <span style={{ "--i": 18 } as React.CSSProperties}></span>
            <span style={{ "--i": 16 } as React.CSSProperties}></span>
            <span style={{ "--i": 19 } as React.CSSProperties}></span>
            <span style={{ "--i": 20 } as React.CSSProperties}></span>
            <span style={{ "--i": 22 } as React.CSSProperties}></span>
            <span style={{ "--i": 25 } as React.CSSProperties}></span>
            <span style={{ "--i": 18 } as React.CSSProperties}></span>
            <span style={{ "--i": 21 } as React.CSSProperties}></span>
            <span style={{ "--i": 13 } as React.CSSProperties}></span>
            <span style={{ "--i": 15 } as React.CSSProperties}></span>
            <span style={{ "--i": 26 } as React.CSSProperties}></span>
            <span style={{ "--i": 17 } as React.CSSProperties}></span>
            <span style={{ "--i": 13 } as React.CSSProperties}></span>
            <span style={{ "--i": 28 } as React.CSSProperties}></span>
            <span style={{ "--i": 11 } as React.CSSProperties}></span>
            <span style={{ "--i": 12 } as React.CSSProperties}></span>
            <span style={{ "--i": 24 } as React.CSSProperties}></span>
            <span style={{ "--i": 10 } as React.CSSProperties}></span>
            <span style={{ "--i": 14 } as React.CSSProperties}></span>
            <span style={{ "--i": 23 } as React.CSSProperties}></span>
            <span style={{ "--i": 18 } as React.CSSProperties}></span>
            <span style={{ "--i": 16 } as React.CSSProperties}></span>
            <span style={{ "--i": 19 } as React.CSSProperties}></span>
            <span style={{ "--i": 20 } as React.CSSProperties}></span>
            <span style={{ "--i": 22 } as React.CSSProperties}></span>
            <span style={{ "--i": 25 } as React.CSSProperties}></span>
            <span style={{ "--i": 18 } as React.CSSProperties}></span>
            <span style={{ "--i": 21 } as React.CSSProperties}></span>
            <span style={{ "--i": 13 } as React.CSSProperties}></span>
            <span style={{ "--i": 15 } as React.CSSProperties}></span>
            <span style={{ "--i": 26 } as React.CSSProperties}></span>
            <span style={{ "--i": 17 } as React.CSSProperties}></span>
            <span style={{ "--i": 13 } as React.CSSProperties}></span>
            <span style={{ "--i": 28 } as React.CSSProperties}></span>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default LandingPage;
