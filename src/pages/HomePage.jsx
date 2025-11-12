import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";

const generateRoomCode = () => {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 4 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
};

const HomePage = () => {
  const navigate = useNavigate();
  const { username, setUsername, setRoomCode } = useGame();
  const [roomInput, setRoomInput] = useState("");
  const [error, setError] = useState("");

  const handleCreateRoom = () => {
    if (!username.trim()) {
      setError("Enter a username to get started.");
      return;
    }

    const newRoomCode = generateRoomCode();
    setRoomCode(newRoomCode);
    setError("");
    navigate(`/scribble/room/${newRoomCode}`);
  };

  const handleJoinRoom = () => {
    if (!username.trim()) {
      setError("Enter a username to join a room.");
      return;
    }

    if (!roomInput.trim()) {
      setError("Add a room code to join the game.");
      return;
    }

    const cleanedCode = roomInput.trim().toUpperCase();
    setRoomCode(cleanedCode);
    setError("");
    navigate(`/scribble/room/${cleanedCode}`);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.35),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(236,72,153,0.25),_transparent_55%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-12 px-6 py-16 text-center">
        <div className="flex flex-col items-center gap-3">
          <span className="rounded-full border border-sky-400 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-sky-300">
            Playful real-time guessing
          </span>
          <h1 className="text-4xl font-bold text-slate-50 sm:text-5xl md:text-6xl">
            Sketch &amp; Guess with <span className="text-sky-400">Scribbly</span>
          </h1>
          <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
            Jump into vibrant rooms, sketch hilarious prompts, and race friends to guess the word first.
            We crafted a smooth UI so you can focus on the fun. Ready when you are.
          </p>
        </div>

        <div className="w-full max-w-xl rounded-3xl border border-slate-800/70 bg-slate-900/60 p-8 shadow-2xl shadow-sky-950/60 backdrop-blur">
          <div className="mb-6 flex flex-col gap-2 text-left">
            <label htmlFor="username" className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Your awesome nickname"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-xl border border-transparent bg-slate-800/80 px-4 py-3 text-base text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/70"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleCreateRoom}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 px-5 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:scale-[1.02] hover:shadow-sky-400/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
            >
              Create Room
            </button>
            <button
              type="button"
              onClick={handleJoinRoom}
              className="inline-flex items-center justify-center rounded-xl border border-sky-500/40 px-5 py-3 text-base font-semibold text-sky-300 transition hover:border-sky-400 hover:bg-slate-800/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40"
            >
              Join Room
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-2 text-left">
            <label htmlFor="room-code" className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              Room Code
            </label>
            <input
              id="room-code"
              type="text"
              placeholder="Enter room code (e.g. ABCD)"
              value={roomInput}
              onChange={(event) => setRoomInput(event.target.value.toUpperCase())}
              className="w-full rounded-xl border border-transparent bg-slate-800/80 px-4 py-3 text-base text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/70"
            />
          </div>

          {error ? <p className="mt-4 text-sm font-semibold text-rose-300">{error}</p> : null}
        </div>

        <div className="grid w-full max-w-4xl gap-6 sm:grid-cols-3">
          {["Create private rooms", "Draw with realtime tools", "Compete across live rounds"].map((feature) => (
            <div
              key={feature}
              className="rounded-2xl border border-slate-800/70 bg-slate-900/50 px-5 py-6 text-left shadow-lg shadow-slate-950/40 backdrop-blur"
            >
              <h3 className="text-lg font-semibold text-slate-100">{feature}</h3>
              <p className="mt-2 text-sm text-slate-400">
                Bring your friends, flex your creativity, and keep the guesses coming with instant feedback.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
