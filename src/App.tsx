import React from 'react';
import Game from './components/Game';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <div className="title-container">
        <h1 className="title">
          <span className="title-part">Cyber</span>
          <span className="title-part highlight">Tetris</span>
        </h1>
        <div className="title-glow"></div>
      </div>
      <Game />
    </div>
  );
};

export default App; 