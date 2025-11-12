import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CanvasBoard from "../components/game/CanvasBoard";
import ChatPanel from "../components/game/ChatPanel";
import GameHeader from "../components/game/GameHeader";
import PlayerSidebar from "../components/game/PlayerSidebar";
import { useGame } from "../context/GameContext";

const GameRoomPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const {
    roomCode,
    setRoomCode,
    players,
    chatMessages,
    addChatMessage,
    drawerId,
    round,
    totalRounds,
    timer,
    wordHint,
    currentPlayerId,
  } = useGame();

  useEffect(() => {
    if (!roomId) {
      return;
    }

    if (roomCode !== roomId) {
      setRoomCode(roomId.toUpperCase());
    }
  }, [roomId, roomCode, setRoomCode]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.15),_transparent_55%),_radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.2),_transparent_55%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-400 to-fuchsia-500 text-lg font-black text-slate-950 shadow-lg shadow-sky-500/40">
              SG
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.35rem] text-slate-400">Scribbly</p>
              <h1 className="text-xl font-semibold text-slate-100">Room {roomCode}</h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/scribble/results")}
            className="hidden items-center gap-2 rounded-xl border border-slate-700/70 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50 sm:inline-flex"
          >
            View Scoreboard
          </button>
        </div>

        <GameHeader timer={timer} round={round} totalRounds={totalRounds} wordHint={wordHint} />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1.2fr)_minmax(0,1fr)]">
          <CanvasBoard isDrawer={drawerId === currentPlayerId} />
          <ChatPanel messages={chatMessages} onSend={addChatMessage} />
          <PlayerSidebar
            players={players}
            drawerId={drawerId}
            currentPlayerId={currentPlayerId}
            round={round}
            totalRounds={totalRounds}
            roomCode={roomCode}
          />
        </div>

        <div className="flex flex-col gap-3 rounded-3xl border border-slate-800 bg-slate-900/60 px-6 py-5 text-sm text-slate-300 shadow-lg shadow-slate-950/30 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
              Pro tip
            </span>
            Draw bold shapes first, then add details so your teammates can guess faster.
          </div>
          <button
            type="button"
            onClick={() => navigate("/scribble")}
            className="inline-flex items-center justify-center rounded-xl border border-rose-500/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-rose-200 transition hover:border-rose-400 hover:bg-rose-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/40"
          >
            Leave Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameRoomPage;
