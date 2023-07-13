import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

import LandingPage from "./LandingPage";
import TrendingPage from "./TrendingPage";
import BoardSelector from "./BoardSelector";
import BoardPage from "./BoardPage";

// Define the App component
const App: React.FC = () => {
  return (
    // Wrap the entire app with the Auth0Provider to handle authentication
    <Auth0Provider
      domain={'dev-datv3cnf7jn5ysok.us.auth0.com'}
      clientId={'REd3U1UTVr639GXUanZWZnVd6RTqq1nm'}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      {/* Use the BrowserRouter component to enable routing */}
      <Router>
        {/* Define the routes for the application */}
        <Routes>
          {/* The LandingPage component will be shown when the path is "/" */}
          {/* If the user is authenticated, redirect to the BoardSelector page */}
          <Route path="/" element={<LandingPage />} />
          {/* The TrendingPage component will be shown when the path is "/trending" */}
          <Route path="/trending" element={<TrendingPage />} />
          {/* The BoardSelector component will be shown when the path is "/board" */}
          <Route path="/board" element={<BoardSelector />} />
          {/* The BoardPage component will be shown when the path is "/board/:id/:title" */}
          <Route path="/board/:id/:title" element={<BoardPage />} />
        </Routes>
      </Router>
    </Auth0Provider>
  );
};

// Export the App component as the default export
export default App;