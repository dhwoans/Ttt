import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const ColumnOne = ({ currentPlayer, onReset }) => {
  const playerXRowStyle = {
    background: currentPlayer === "X" ? "var(--olive)" : "transparent",
    color: currentPlayer === "X" ? "var(--pink)" : "var(--olive)",
  };
  const playerORowStyle = {
    background: currentPlayer === "O" ? "var(--olive)" : "transparent",
    color: currentPlayer === "O" ? "var(--pink)" : "var(--olive)",
  };

  return (
    <section className="col col-1">
      <div className="header-module">
        <h1 className="blitz-type title-medium">
          BLITZ
          <br />
          KREUZ
        </h1>
        <p style={{ marginTop: "10px", fontWeight: 900, fontSize: "0.8rem" }}>
          MULTIPLAYER_V.01
        </p>
      </div>
      <div style={{ flexGrow: 1 }}>
        <div className="player-row" style={playerXRowStyle}>
          <div className="blitz-type" style={{ fontSize: "1.5rem" }}>
            USER_X
          </div>
          <div style={{ fontWeight: 900 }} className="status">
            READY
          </div>
        </div>
        <div className="player-row" style={playerORowStyle}>
          <div className="blitz-type" style={{ fontSize: "1.5rem" }}>
            USER_O
          </div>
          <div style={{ fontWeight: 900 }} className="status">
            READY
          </div>
        </div>
        <div className="player-row">
          <div className="blitz-type" style={{ fontSize: "1.5rem" }}>
            SPECTATOR_1
          </div>
          <div style={{ fontWeight: 900 }}>IDLE</div>
        </div>
        <div className="player-row">
          <div className="blitz-type" style={{ fontSize: "1.5rem" }}>
            G_BERNDT
          </div>
          <div style={{ fontWeight: 900 }}>READY</div>
        </div>
      </div>
      <button className="blitz-btn blitz-type" onClick={onReset}>
        RESET_SESSION
      </button>
      <svg
        className="blob-svg"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M44.7,-76.4C58.3,-69.2,70,-57.9,78.7,-44.5C87.4,-31.1,93.1,-15.5,91.3,-0.9C89.5,13.6,80.3,27.2,71.2,40.1C62.1,53,53.2,65.3,41.1,72.8C29,80.3,13.7,83,0.3,82.4C-13,81.8,-26.1,78,-38.7,71.4C-51.3,64.8,-63.5,55.5,-71.4,43.4C-79.3,31.3,-82.9,15.7,-82.1,0.5C-81.2,-14.7,-75.9,-29.4,-67.2,-41.8C-58.5,-54.2,-46.4,-64.3,-33.1,-71.6C-19.8,-78.9,-9.9,-83.4,2.5,-87.7C14.8,-92,29.7,-96.2,44.7,-76.4Z"
          transform="translate(100 100)"
        />
      </svg>
    </section>
  );
};

const ColumnTwo = ({ gameState, boardTransform, boardBg, onCellClick }) => {
  return (
    <section className="col col-2">
      <div className="header-module" style={{ textAlign: "center" }}>
        <h1
          className="blitz-type title-large"
          style={{ letterSpacing: "-0.12em" }}
        >
          KREUZ
        </h1>
      </div>
      <div className="game-container">
        <div
          id="ttt-board"
          style={{
            transform: boardTransform,
            ...(boardBg ? { backgroundColor: boardBg } : {}),
          }}
        >
          {gameState.map((cell, index) => (
            <div
              key={index}
              className={`cell blitz-type ${cell ? "taken" : ""} ${cell === "X" ? "symbol-x" : ""} ${cell === "O" ? "symbol-o" : ""}`}
              data-index={index}
              onClick={() => onCellClick(index)}
            >
              {cell}
            </div>
          ))}
        </div>
      </div>
      <div className="billing-block">
        <p>
          DIRECTED BY <span>GUISEPPE BERNDT</span> ART DIRECTION BY{" "}
          <span>HOLGER SCHNEIDER</span>
        </p>
        <p>
          TIC-TAC-TOE® CORE ENGINE PRODUCED BY <span>LICHT ZENTRALE</span>{" "}
          ASSOCIATE PRODUCER <span>ANTONIA KARL-HEINZ</span>
        </p>
        <p>
          SOUND DESIGN <span>DIETER BOHLEN</span> LEAD ENGINEER{" "}
          <span>MAXIMILIAN VOLLMER</span> SERVER INFRASTRUCTURE{" "}
          <span>DATA_NODE_7</span>
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            marginTop: "10px",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <circle
              cx="10"
              cy="10"
              r="8"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          <svg width="20" height="20" viewBox="0 0 20 20">
            <rect
              x="4"
              y="4"
              width="12"
              height="12"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path
              d="M4 16 L10 4 L16 16 Z"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

const ColumnThree = ({ currentPlayer, xScore, oScore, logs }) => {
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <section className="col col-3">
      <div className="stat-block">
        <div className="stat-label blitz-type">CURRENT_TURN</div>
        <div className="stat-value blitz-type">{currentPlayer}</div>

        <div className="stat-label blitz-type" style={{ marginTop: "60px" }}>
          X_WINS
        </div>
        <div className="stat-value blitz-type">
          {xScore.toString().padStart(5, "0")}
        </div>

        <div className="stat-label blitz-type" style={{ marginTop: "60px" }}>
          O_WINS
        </div>
        <div className="stat-value blitz-type">
          {oScore.toString().padStart(5, "0")}
        </div>
      </div>

      <div
        style={{
          padding: "20px",
          background: "var(--teal)",
          color: "var(--yellow)",
        }}
      >
        <div className="blitz-type" style={{ fontSize: "1.2rem" }}>
          SYSTEM_LOG
        </div>
        <div
          ref={logRef}
          style={{
            fontSize: "10px",
            fontWeight: 900,
            lineHeight: 1.5,
            marginTop: "10px",
            overflowY: "auto",
            maxHeight: "150px",
          }}
        >
          {logs.map((log, i) => (
            <React.Fragment key={i}>
              {log}
              <br />
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

const ColumnFour = ({ xScore, oScore }) => {
  return (
    <section className="col col-4">
      <div className="header-module">
        <h2 className="blitz-type" style={{ fontSize: "3rem" }}>
          HIGH
          <br />
          SCOR
        </h2>
      </div>

      <div style={{ padding: "0 20px" }}>
        <div
          style={{
            borderBottom: "2px solid var(--orange)",
            padding: "10px 0",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span className="blitz-type">01. MARKO</span>
          <span style={{ fontWeight: 900 }}>999,999</span>
        </div>
        <div
          style={{
            borderBottom: "2px solid var(--orange)",
            padding: "10px 0",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span className="blitz-type">02. ELSA_B</span>
          <span style={{ fontWeight: 900 }}>854,200</span>
        </div>
        <div
          style={{
            borderBottom: "2px solid var(--orange)",
            padding: "10px 0",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span className="blitz-type">03. R_VOX</span>
          <span style={{ fontWeight: 900 }}>721,090</span>
        </div>
        <div
          style={{
            borderBottom: "2px solid var(--orange)",
            padding: "10px 0",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span className="blitz-type">04. USER_X</span>
          <span style={{ fontWeight: 900 }}>
            {(xScore * 100).toString().padStart(3, "0") + ",000"}
          </span>
        </div>
        <div
          style={{
            borderBottom: "2px solid var(--orange)",
            padding: "10px 0",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span className="blitz-type">05. USER_O</span>
          <span style={{ fontWeight: 900 }}>
            {(oScore * 100).toString().padStart(3, "0") + ",000"}
          </span>
        </div>
      </div>

      <div
        style={{
          marginTop: "auto",
          padding: "20px",
          background: "var(--orange)",
          color: "var(--pink)",
        }}
      >
        <p className="blitz-type" style={{ fontSize: "0.9rem" }}>
          (C) 2024 LICHT ZENTRALE STUDIOS. ALL RIGHTS RESERVED. NO UNAUTHORIZED
          REPLICATION OF DATA STRUCTURES ALLOWED.
        </p>
      </div>
    </section>
  );
};

const GamePage = () => {
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [gameState, setGameState] = useState(Array(9).fill(""));
  const [gameActive, setGameActive] = useState(true);
  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);
  const [logs, setLogs] = useState([
    "> INITIALIZING BLITZ_PROTOCOL...",
    "> SYNCING WITH BERLIN_NODE_01...",
    "> GRID SECURED.",
    "> READY FOR INPUT.",
  ]);
  const [boardTransform, setBoardTransform] = useState("");
  const [boardBg, setBoardBg] = useState("");

  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString([], {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLogs((prev) => [...prev, `> [${time}] ${msg}`]);
  };

  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  useEffect(() => {
    const handleKeyDown = () => {
      setBoardTransform(
        `scale(1.05) translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`,
      );
      setTimeout(() => setBoardTransform(""), 50);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCellClick = (index) => {
    if (gameState[index] !== "" || !gameActive) return;

    const newGameState = [...gameState];
    newGameState[index] = currentPlayer;
    setGameState(newGameState);

    setBoardTransform(`scale(1.02) rotate(${Math.random() * 2 - 1}deg)`);
    setTimeout(() => setBoardTransform(""), 100);

    addLog(`PLAYER_${currentPlayer} MARKED CELL_${index}`);

    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
      const [a, b, c] = winningConditions[i];
      if (
        newGameState[a] === "" ||
        newGameState[b] === "" ||
        newGameState[c] === ""
      )
        continue;
      if (
        newGameState[a] === newGameState[b] &&
        newGameState[b] === newGameState[c]
      ) {
        roundWon = true;
        break;
      }
    }

    if (roundWon) {
      addLog(`CRITICAL: PLAYER_${currentPlayer} WON MATCH`);
      setGameActive(false);
      if (currentPlayer === "X") {
        setXScore((s) => s + 1);
      } else {
        setOScore((s) => s + 1);
      }
      setBoardBg("#E9E65D");
      setTimeout(() => setBoardBg(""), 500);
      return;
    }

    if (!newGameState.includes("")) {
      addLog(`SYSTEM_ALERT: MATCH DRAWN`);
      setGameActive(false);
      return;
    }

    setCurrentPlayer((prev) => (prev === "X" ? "O" : "X"));
  };

  const resetGame = () => {
    setGameActive(true);
    setCurrentPlayer("X");
    setGameState(Array(9).fill(""));
    setBoardBg("");
    setBoardTransform("");
    addLog("PROTOCOL_RESET: NEW MATCH INITIALIZED");
  };

  return (
    <div className="game-app">
      <div className="noise" />
      <ColumnOne currentPlayer={currentPlayer} onReset={resetGame} />
      <ColumnTwo
        gameState={gameState}
        boardTransform={boardTransform}
        boardBg={boardBg}
        onCellClick={handleCellClick}
      />
      <ColumnThree
        currentPlayer={currentPlayer}
        xScore={xScore}
        oScore={oScore}
        logs={logs}
      />
      <ColumnFour xScore={xScore} oScore={oScore} />
    </div>
  );
};

const App = () => {
  useEffect(() => {
    const css = `
      @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;900&display=swap');

      :root {
        --orange: #FF5E2A;
        --pink: #E3A6C4;
        --yellow: #E9E65D;
        --teal: #266070;
        --olive: #4A4E27;
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        -webkit-font-smoothing: antialiased;
      }

      .game-app {
        background-color: var(--olive);
        font-family: 'Inter', sans-serif;
        color: white;
        overflow: hidden;
        height: 100vh;
        width: 100vw;
        display: grid;
        grid-template-columns: 20% 40% 20% 20%;
        cursor: crosshair;
      }

      .blitz-type {
        font-family: 'Archivo Black', sans-serif;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: -0.08em;
        line-height: 0.85;
      }

      .col {
        height: 100vh;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;
        transition: width 0.3s cubic-bezier(0.23, 1, 0.32, 1);
      }

      .col-1 { background-color: var(--pink); color: var(--olive); }
      .col-2 { background-color: var(--orange); color: var(--pink); border-left: 1px solid rgba(0,0,0,0.1); }
      .col-3 { background-color: var(--yellow); color: var(--teal); }
      .col-4 { background-color: var(--teal); color: var(--orange); }

      .header-module {
        padding: 20px;
        flex-shrink: 0;
      }

      .title-large {
        font-size: clamp(3rem, 10vw, 8rem);
        word-wrap: break-word;
      }

      .title-medium {
        font-size: clamp(2rem, 5vw, 4rem);
      }

      .game-container {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 5vh;
      }

      #ttt-board {
        width: 450px;
        height: 450px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(3, 1fr);
        position: relative;
        border: 12px solid var(--olive);
        background-color: var(--olive);
        gap: 12px;
      }

      .cell {
        background: var(--orange);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 6rem;
        cursor: pointer;
        transition: background 0.1s;
      }

      .cell:hover {
        background: #ff754a;
      }

      .cell.taken {
        cursor: default;
      }

      .billing-block {
        padding: 20px;
        font-size: 9px;
        text-transform: uppercase;
        line-height: 1.2;
        text-align: center;
        letter-spacing: 0.05em;
        margin-top: auto;
      }

      .billing-block span {
        font-weight: 900;
        margin-right: 4px;
      }

      .player-row {
        padding: 15px 20px;
        border-bottom: 10px solid var(--olive);
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
      }

      .player-row:last-child { border-bottom: none; }

      .blitz-btn {
        background: var(--teal);
        color: var(--yellow);
        border: none;
        padding: 20px;
        width: 100%;
        font-family: 'Archivo Black';
        font-size: 2rem;
        cursor: pointer;
        transition: all 0.2s;
        text-align: left;
        margin-top: 20px;
      }

      .blitz-btn:hover {
        background: var(--olive);
        color: var(--pink);
      }

      .blob-svg {
        position: absolute;
        bottom: -50px;
        left: -50px;
        width: 300px;
        fill: var(--olive);
        z-index: 0;
        opacity: 0.8;
        pointer-events: none;
      }

      .stat-block {
        padding: 40px 20px;
        flex-grow: 1;
      }

      .stat-label {
        font-size: 0.7rem;
        font-weight: 900;
        opacity: 0.6;
      }

      .stat-value {
        font-size: 6rem;
        margin-top: -10px;
      }

      @media (max-width: 1200px) {
        .game-app { grid-template-columns: 25% 50% 25%; }
        .col-4 { display: none; }
      }

      @media (max-width: 800px) {
        .game-app { grid-template-columns: 100%; overflow-y: auto; height: auto; }
        .col { height: auto; min-height: 100vh; }
        #ttt-board { width: 300px; height: 300px; }
      }

      .noise {
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        z-index: 1000;
        pointer-events: none;
        opacity: 0.04;
        background: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      }

      .symbol-x { color: var(--teal); }
      .symbol-o { color: var(--pink); }

      .winner-line {
        position: absolute;
        background: var(--yellow);
        z-index: 10;
        display: none;
      }
    `;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <Router basename="/">
      <Routes>
        <Route path="*" element={<GamePage />} />
      </Routes>
    </Router>
  );
};

export default App;
