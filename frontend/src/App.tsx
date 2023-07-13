import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

import LandingPage from "./LandingPage";
import TrendingPage from "./TrendingPage";
import BoardSelector from "./BoardSelector";
import BoardPage from "./BoardPage";

const App: React.FC = () => {
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN!}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID!}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/boards" element={<BoardSelector />} />
          <Route path="/boards/:id" element={<BoardPage />} />
        </Routes>
      </Router>
    </Auth0Provider>
  );
};

export default App;