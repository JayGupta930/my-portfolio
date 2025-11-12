const PlayerSidebar = ({ players, drawerId, currentPlayerId, round, totalRounds, roomCode }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <aside className="flex h-full flex-col rounded-3xl border border-slate-800 bg-slate-900/70 shadow-xl shadow-slate-950/40">
      <div className="border-b border-slate-800 px-5 py-4">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-400">
          <span>Players</span>
          <span>Round {round}/{totalRounds}</span>
        </div>
        <p className="mt-1 text-xs text-slate-500">Room code: <span className="font-mono text-sky-300">{roomCode}</span></p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <ul className="flex flex-col gap-4">
          {sortedPlayers.map((player, index) => {
            const isDrawer = player.id === drawerId;
            const isYou = player.id === currentPlayerId;
            return (
              <li
                key={player.id}
                className={`relative overflow-hidden rounded-2xl border px-4 py-4 ${
                  isDrawer ? "border-emerald-500/50 bg-emerald-900/20" : "border-slate-800/60 bg-slate-950/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-slate-700 bg-slate-800">
                    <img src={player.avatar} alt={player.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-100">{player.name}</p>
                        {player.isHost ? (
                          <span className="rounded-full border border-sky-500/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-300">
                            Host
                          </span>
                        ) : null}
                        {isYou ? (
                          <span className="rounded-full border border-cyan-500/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-200">
                            You
                          </span>
                        ) : null}
                      </div>
                      <span className="text-sm font-semibold text-slate-200">{player.score} pts</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400"
                        style={{ width: `${Math.min(100, Math.max(12, (player.score / 300) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>

                {isDrawer ? (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-900/20 px-3 py-2 text-xs font-semibold text-emerald-200">
                    <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
                    Drawing this round
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="border-t border-slate-800 px-5 py-4 text-xs text-slate-500">
        <p className="font-semibold uppercase tracking-wide text-slate-400">Up next</p>
        <div className="mt-2 flex items-center gap-2 text-slate-300">
          {sortedPlayers.map((player, index) => {
            if (player.id === drawerId || index > 3) {
              return null;
            }
            return (
              <span key={player.id} className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200">
                {player.name}
              </span>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default PlayerSidebar;
