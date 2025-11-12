const formatTimer = (value) => {
  const minutes = Math.floor(value / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const GameHeader = ({ timer, round, totalRounds, wordHint }) => {
  const timerPercentage = Math.max(4, Math.min(100, (timer / 75) * 100));

  return (
    <header className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/40 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-slate-50 sm:text-3xl">Round {round} of {totalRounds}</h1>
        <p className="mt-1 text-sm text-slate-400">
          Guess the word before the timer runs out. Points reward the fastest minds.
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <div className="relative h-24 w-24">
          <div
            className="absolute inset-0 rounded-full border-2 border-slate-800"
            style={{
              background: `conic-gradient(#38bdf8 ${timerPercentage}%, rgba(15,23,42,0.8) ${timerPercentage}% 100%)`,
            }}
          />
          <div className="absolute inset-2 flex items-center justify-center rounded-full bg-slate-950/90 shadow-inner shadow-slate-900/80">
            <span className="text-lg font-semibold text-slate-100">{formatTimer(timer)}</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 px-6 py-4 text-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Word Hint</span>
          <p className="text-2xl font-bold tracking-[0.5rem] text-sky-300">
            {wordHint}
          </p>
          <span className="text-xs text-slate-500">Letters reveal as the timer drops.</span>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;
