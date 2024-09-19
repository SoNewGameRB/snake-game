import React, { useState, useEffect, useRef } from 'react';
import './SnakeGame.css';

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 1, y: 0 }); // 設置初始方向為向右
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(200); // 設置初始速度
  const [gameStarted, setGameStarted] = useState(false); // 控制遊戲是否已經開始
  const gridSize = 20;
  const boardSize = 20;
  const intervalRef = useRef(null);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize) });
    setDirection({ x: 1, y: 0 }); // 重置方向為向右
    setGameOver(false);
    setGameStarted(false); // 重置遊戲為未開始狀態
  };

  const startGame = (selectedSpeed) => {
    setSpeed(selectedSpeed); // 根據選擇的難度設置速度
    setGameStarted(true); // 開始遊戲
    setGameOver(false); // 重置遊戲結束狀態
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 }); // 防止蛇掉頭
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [direction]);

  useEffect(() => {
    if (!gameStarted || gameOver) return; // 如果遊戲未開始或已結束，不啟動計時器

    intervalRef.current = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };

        head.x += direction.x;
        head.y += direction.y;

        if (head.x < 0 || head.y < 0 || head.x >= boardSize || head.y >= boardSize) {
          setGameOver(true);
          clearInterval(intervalRef.current);
          return prevSnake;
        }

        for (let i = 0; i < newSnake.length; i++) {
          if (newSnake[i].x === head.x && newSnake[i].y === head.y) {
            setGameOver(true);
            clearInterval(intervalRef.current);
            return prevSnake;
          }
        }

        newSnake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
          setFood({
            x: Math.floor(Math.random() * boardSize),
            y: Math.floor(Math.random() * boardSize),
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [direction, food, speed, gameStarted, gameOver]);

  return (
    <div className="game-container">
      {!gameStarted ? ( // 如果遊戲尚未開始，顯示難度選擇畫面
        <div className="difficulty-selection">
          <h2>選擇遊戲難度</h2>
          <button onClick={() => startGame(500)}>簡單 (慢速)</button>
          <button onClick={() => startGame(100)}>困難 (快速)</button>
        </div>
      ) : (
        <>
          <div className="game-header">
            <h1>貪吃蛇小遊戲</h1>
            <p>使用方向鍵控制貪吃蛇移動，吃到紅色方塊增加身長。遊戲結束後，按下重新開始。</p>
          </div>
          {gameOver ? (
            <div className="game-over">
              <h2>遊戲結束</h2>
              <button onClick={resetGame}>重新開始</button>
            </div>
          ) : (
            <div className="board">
              {Array.from({ length: boardSize }).map((_, y) =>
                Array.from({ length: boardSize }).map((_, x) => (
                  <div
                    key={`${x}-${y}`}
                    className={`cell ${
                      snake.some((segment) => segment.x === x && segment.y === y) ? 'snake' : ''
                    } ${food.x === x && food.y === y ? 'food' : ''}`}
                  />
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SnakeGame;
