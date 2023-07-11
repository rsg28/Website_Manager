import logo from './logo.svg';
import './App.css';
import LoginButton from './components/LoginButton';

import LogOutButton from './components/LogoutButton';


function App() {
  return (
    <main>
      <h1>Auth0 login</h1>
      <LoginButton/>
      <LogOutButton/>
    </main>
  );
}

export default App;
