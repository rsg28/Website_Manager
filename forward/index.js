import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Auth0Provider}from '@auth0/auth0-react'

const domain ='dev-datv3cnf7jn5ysok.us.auth0.com';

const clientId ='REd3U1UTVr639GXUanZWZnVd6RTqq1nm';

// npm install @auth0/auth0-react 

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);