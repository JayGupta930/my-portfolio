import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";

const ResultsPage = () => {
  const navigate = useNavigate();
  const { players, roomCode, resetGame } = useGame();

  const leaderboard = useMemo(() => {
    return [...players].sort((a, b) => b.score - a.score);
  }, [players]);

  const winner = leaderboard[0];

  const handlePlayAgain = () => {
    resetGame();
    const targetRoom = roomCode || "PLAY";
    navigate(`/scribble/room/${targetRoom}`);
  };

  const handleExit = () => {
    resetGame();
    navigate("/scribble");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(236,72,153,0.2),_transparent_55%)]" />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-6 py-16 text-center">
        <div className="flex flex-col items-center gap-3">
          <span className="rounded-full border border-amber-400/60 bg-amber-500/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-amber-200">
            Game Over
          </span>
          <h1 className="text-4xl font-bold text-slate-50 sm:text-5xl">Final Scoreboard</h1>
          <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
            What a match! Here are the final standings. Invite your crew to jump back into a fresh round whenever
            you are ready.
          </p>
        </div>

        {winner ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-amber-400/40 bg-amber-500/10 px-8 py-6 text-center shadow-xl shadow-amber-600/20">
            <p className="text-sm font-semibold uppercase tracking-[0.35rem] text-amber-200">Champion</p>
            <div className="flex items-center gap-4">
              <img
                src={winner.avatar}
                alt={winner.name}
                className="h-16 w-16 rounded-full border-2 border-amber-400 bg-amber-300/40 object-cover"
              />
              <div className="text-left">
                <p className="text-lg font-semibold text-amber-100">{winner.name}</p>
                <p className="text-sm text-amber-200">{winner.score} points</p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {leaderboard.map((player, index) => (
            <div
              key={player.id}
              className="flex flex-col items-center gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 px-6 py-8 text-center shadow-lg shadow-slate-950/40"
            >
              <div className="flex items-center justify-between w-full text-xs uppercase tracking-wide text-slate-500">
                <span>#{index + 1}</span>
                {index === 0 ? <span className="text-amber-300">MVP</span> : null}
              </div>
              <img src={player.avatar} alt={player.name} className="h-20 w-20 rounded-full border border-slate-700 bg-slate-800 object-cover" />
              <div>
                <p className="text-lg font-semibold text-slate-100">{player.name}</p>
                <p className="text-sm text-slate-400">{player.score} pts</p>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-sky-400"
                  style={{ width: `${Math.min(100, Math.max(10, (player.score / (leaderboard[0]?.score || 1)) * 100))}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            type="button"
            onClick={handlePlayAgain}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 px-6 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-sky-500/40 transition hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
          >
            Play Again
          </button>
          <button
            type="button"
            onClick={handleExit}
            className="inline-flex items-center justify-center rounded-xl border border-slate-700/70 px-6 py-3 text-base font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/30"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
