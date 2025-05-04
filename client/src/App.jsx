import React from 'react';
import MainChatPage from './pages/MainChatPage';
import Login from './components/Login';

const App = () => {
  return (
    <div className="app">
      <Login/>
      <MainChatPage />
    </div>
  );
};

export default App;
