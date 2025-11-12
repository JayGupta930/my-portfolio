import { useEffect, useRef, useState } from "react";

const formatTime = (timestamp) => {
  try {
    return new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit" }).format(new Date(timestamp));
  } catch (error) {
    return "--:--";
  }
};

const ChatPanel = ({ messages, onSend }) => {
  const [message, setMessage] = useState("");
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: messages.length <= 1 ? "auto" : "smooth",
    });
  }, [messages]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!message.trim()) {
      return;
    }

    onSend(message);
    setMessage("");
  };

  return (
    <div className="flex h-full flex-col rounded-3xl border border-slate-800 bg-slate-900/70 shadow-xl shadow-slate-950/40">
      <header className="border-b border-slate-800 px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-100">Live Chat</h2>
        <p className="text-sm text-slate-400">Guess the word or cheer on your friends.</p>
      </header>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-5 py-4">
        <ul className="flex flex-col gap-4">
          {messages.map((entry) => {
            const isSystem = entry.kind === "system";
            const isCorrect = entry.kind === "correct";
            return (
              <li
                key={entry.id}
                className={`flex flex-col gap-1 rounded-2xl border px-4 py-3 ${
                  isSystem
                    ? "border-sky-700/40 bg-sky-900/40 text-sky-200"
                    : isCorrect
                    ? "border-emerald-600/40 bg-emerald-900/30"
                    : "border-slate-800/60 bg-slate-900/50"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide">
                  <span className={isSystem ? "text-sky-200" : isCorrect ? "text-emerald-300" : "text-slate-300"}>
                    {entry.author}
                  </span>
                  <time className="text-slate-500">{formatTime(entry.timestamp)}</time>
                </div>
                <p className="text-sm text-slate-100">
                  {isCorrect ? `${entry.author} guessed it! ${entry.content}` : entry.content}
                </p>
              </li>
            );
          })}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="border-t border-slate-800 px-5 py-4">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 px-3">
          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Type your guess..."
            className="flex-1 bg-transparent py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;
