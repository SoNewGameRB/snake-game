import React from 'react';
import ReactDOM from 'react-dom/client'; // 修改這行
import './index.css';
import SnakeGame from './SnakeGame';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SnakeGame />
  </React.StrictMode>
);
