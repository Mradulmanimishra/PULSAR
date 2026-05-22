/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { useMemo } from 'react';
import { Game } from './components/Game';
import { MobileControls } from './components/MobileControls';
import { useGameStore } from './store';
import { useIsMobile } from './hooks/useIsMobile';

function HUD() {
  const score = useGameStore(state => state.score);
  const timeLeft = useGameStore(state => state.timeLeft);
  const playerState = useGameStore(state => state.playerState);
  const otherPlayers = useGameStore(state => state.otherPlayers);
  const events = useGameStore(state => state.events);
  const timesTagged = useGameStore(state => state.timesTagged);
  const gameState = useGameStore(state => state.gameState);
  const leaveGame = useGameStore(state => state.leaveGame);
  const isMobile = useIsMobile();

  const playerCount = Object.keys(otherPlayers).length + 1;

  const leaderboard = useMemo(() => {
    const players = [
      { id: 'You', score, isMe: true },
      ...Object.values(otherPlayers).map(p => ({ id: p.name, score: p.score, isMe: false }))
    ];
    return players.sort((a, b) => b.score - a.score);
  }, [score, otherPlayers]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = Math.floor(timeLeft) % 60;
  const isLowTime = timeLeft < 30;

  return (
    <>
      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
        <div className="relative">
          <div className={`w-4 h-4 border-2 rounded-full transition-colors duration-200 ${playerState === 'disabled' ? 'border-red-500' : 'border-cyan-400'}`} />
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full transition-colors duration-200 ${playerState === 'disabled' ? 'bg-red-500' : 'bg-cyan-400'}`} />
        </div>
        {!isMobile && (
          <div className="mt-4 text-cyan-400/50 text-xs tracking-widest font-bold">CLICK TO AIM</div>
        )}
      </div>

      {/* HUD Left — Score & Leaderboard */}
      <div className="absolute top-2 left-2 md:top-4 md:left-4 flex flex-col gap-2 md:gap-3 pointer-events-none">
        <div className="text-cyan-400 text-lg md:text-2xl font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
          SCORE: {score.toString().padStart(4, '0')}
        </div>

        {/* Times tagged stat */}
        {timesTagged > 0 && (
          <div className="text-red-400/70 text-xs font-bold tracking-widest">
            TAGGED: {timesTagged}×
          </div>
        )}

        {/* Leaderboard — desktop only */}
        {!isMobile && (
          <div className="bg-black/50 border border-cyan-900/50 p-3 rounded w-48 flex flex-col gap-1 mt-1">
            <div className="text-cyan-400/70 text-xs font-bold mb-1 border-b border-cyan-900/50 pb-1 tracking-widest">
              LEADERBOARD
            </div>
            {leaderboard.map((p, i) => (
              <div
                key={p.id}
                className={`flex justify-between text-sm ${p.isMe ? 'text-cyan-400 font-bold' : 'text-cyan-400/70'}`}
              >
                <span className="truncate max-w-[110px]">{i + 1}. {p.id}</span>
                <span>{p.score}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* HUD Right — Timer, Leave, Events */}
      <div className="absolute top-2 right-2 md:top-4 md:right-4 flex flex-col items-end gap-1 md:gap-2 pointer-events-auto">
        {gameState === 'playing' && (
          <div
            className={`text-lg md:text-2xl font-bold pointer-events-none transition-colors duration-500 ${
              isLowTime
                ? 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.9)] animate-pulse'
                : 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]'
            }`}
          >
            TIME: {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
        )}

        <button
          onClick={leaveGame}
          className="px-2 py-1 md:px-4 md:py-2 bg-red-500/20 border border-red-500 text-red-500 text-xs md:text-sm font-bold rounded hover:bg-red-500 hover:text-black transition-all duration-200"
        >
          LEAVE
        </button>

        {!isMobile && (
          <div className="text-cyan-400/50 text-xs mt-1 pointer-events-none uppercase tracking-widest font-bold">
            ESC to unlock cursor
          </div>
        )}

        {/* Event Log */}
        <div className="mt-2 md:mt-4 flex flex-col items-end gap-1 pointer-events-none">
          {events.slice(-3).map(event => (
            <div
              key={event.id}
              className="text-[10px] md:text-xs font-bold text-fuchsia-400 bg-black/50 px-2 py-1 rounded border border-fuchsia-900/50 animate-pulse"
            >
              {event.message}
            </div>
          ))}
        </div>
      </div>

      {/* Players Online — top center */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="text-cyan-400/70 text-[10px] md:text-sm font-bold tracking-widest">
          PLAYERS: {playerCount}
        </div>
      </div>

      {/* Damage Overlay */}
      {playerState === 'disabled' && (
        <div className="absolute inset-0 bg-red-500/20 pointer-events-none flex items-center justify-center">
          <div className="text-red-500 text-4xl md:text-6xl font-black tracking-widest drop-shadow-[0_0_20px_rgba(239,68,68,1)] animate-pulse text-center">
            SYSTEM DISABLED
          </div>
        </div>
      )}

      {/* Mobile Controls */}
      {isMobile && gameState === 'playing' && <MobileControls />}
    </>
  );
}

export default function App() {
  const gameState = useGameStore(state => state.gameState);
  const score = useGameStore(state => state.score);
  const timesTagged = useGameStore(state => state.timesTagged);
  const otherPlayers = useGameStore(state => state.otherPlayers);
  const startGame = useGameStore(state => state.startGame);
  const leaveGame = useGameStore(state => state.leaveGame);
  const playerName = useGameStore(state => state.playerName);
  const setPlayerName = useGameStore(state => state.setPlayerName);
  const isMobile = useIsMobile();

  // Final leaderboard for game-over screen
  const finalLeaderboard = useMemo(() => {
    const players = [
      { id: playerName.trim() || 'You', score, isMe: true },
      ...Object.values(otherPlayers).map(p => ({ id: p.name, score: p.score, isMe: false }))
    ];
    return players.sort((a, b) => b.score - a.score);
  }, [score, otherPlayers, playerName]);

  const myRank = finalLeaderboard.findIndex(p => p.isMe) + 1;

  return (
    <div className="w-screen h-screen bg-black relative overflow-hidden font-mono select-none">
      {/* 3D Canvas — always rendered */}
      <div className="absolute inset-0">
        <Game />
      </div>

      {/* HUD */}
      {gameState === 'playing' && <HUD />}

      {/* ── MENU ── */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 pointer-events-auto px-4">
          <h1 className="text-4xl md:text-6xl font-black text-cyan-400 mb-2 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)] tracking-tighter text-center">
            NEON ARENA
          </h1>
          <p className="text-fuchsia-400/60 text-xs tracking-widest mb-8">
            MULTIPLAYER LASER TAG
          </p>

          <div className="flex flex-col gap-4 w-full max-w-[320px]">
            {/* Name input */}
            <div className="flex flex-col gap-1">
              <label className="text-cyan-400/60 text-xs tracking-widest font-bold">YOUR NAME</label>
              <input
                type="text"
                maxLength={20}
                placeholder="Enter callsign…"
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') startGame(); }}
                className="w-full px-4 py-2 bg-black/60 border border-cyan-900 text-cyan-400 text-sm font-bold rounded placeholder-cyan-900 focus:outline-none focus:border-cyan-400 focus:drop-shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all"
              />
            </div>

            <button
              onClick={() => startGame()}
              className="w-full px-8 py-4 bg-fuchsia-500/20 border-2 border-fuchsia-400 text-fuchsia-400 text-xl font-bold rounded hover:bg-fuchsia-400 hover:text-black transition-all duration-200 shadow-[0_0_15px_rgba(232,121,249,0.5)]"
            >
              PLAY NOW
            </button>

            <p className="text-gray-500 text-center text-xs leading-relaxed">
              {isMobile
                ? 'Left joystick: move · Right joystick: look · Center: shoot'
                : 'WASD: move · Mouse: look · Click: shoot · ESC: unlock cursor'}
            </p>
          </div>
        </div>
      )}

      {/* ── GAME OVER ── */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-10 pointer-events-auto px-4 overflow-y-auto">
          <h1 className="text-4xl md:text-6xl font-black text-red-500 mb-1 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] tracking-tighter text-center">
            GAME OVER
          </h1>

          <div className="text-cyan-400/60 text-xs tracking-widest mb-6">
            #{myRank} of {finalLeaderboard.length}
          </div>

          {/* Stats row */}
          <div className="flex gap-6 mb-6">
            <div className="flex flex-col items-center">
              <div className="text-2xl md:text-3xl text-cyan-400 font-black">{score}</div>
              <div className="text-cyan-400/50 text-[10px] tracking-widest">SCORE</div>
            </div>
            <div className="w-px bg-cyan-900" />
            <div className="flex flex-col items-center">
              <div className="text-2xl md:text-3xl text-red-400 font-black">{timesTagged}</div>
              <div className="text-red-400/50 text-[10px] tracking-widest">TAGGED</div>
            </div>
          </div>

          {/* Final leaderboard */}
          {finalLeaderboard.length > 1 && (
            <div className="bg-black/60 border border-cyan-900/50 rounded p-4 w-full max-w-[300px] mb-6">
              <div className="text-cyan-400/70 text-xs font-bold mb-2 tracking-widest border-b border-cyan-900/30 pb-1">
                FINAL STANDINGS
              </div>
              {finalLeaderboard.map((p, i) => (
                <div
                  key={p.id}
                  className={`flex justify-between text-sm py-0.5 ${
                    p.isMe ? 'text-cyan-400 font-black' : 'text-cyan-400/60'
                  } ${i === 0 ? 'text-yellow-400' : ''}`}
                >
                  <span className="truncate max-w-[170px]">
                    {i === 0 ? '🏆 ' : `${i + 1}. `}{p.id}{p.isMe ? ' (you)' : ''}
                  </span>
                  <span>{p.score}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3 w-full max-w-[300px]">
            <button
              onClick={() => startGame()}
              className="w-full px-8 py-4 bg-cyan-500/20 border-2 border-cyan-400 text-cyan-400 text-xl font-bold rounded hover:bg-cyan-400 hover:text-black transition-all duration-200 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
            >
              PLAY AGAIN
            </button>
            <button
              onClick={leaveGame}
              className="w-full px-8 py-3 bg-transparent border border-gray-700 text-gray-500 text-sm font-bold rounded hover:border-gray-500 hover:text-gray-300 transition-all duration-200"
            >
              MAIN MENU
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
