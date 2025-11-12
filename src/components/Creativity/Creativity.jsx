import React from "react";
import { useNavigate } from "react-router-dom";
import CreativityContact from "../../Creativity/Contact/Contact";

const Creativity = () => {
  const navigate = useNavigate();

  return (
    <>
      <section
        id="creativity"
        className="relative px-4 font-sans py-12 sm:px-[7vw] sm:py-16 md:px-[7vw] md:py-24 lg:px-[20vw]"
      >
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-5 grid-rows-5 gap-4">
            <div className="col-span-5 row-span-2 rounded-2xl border border-white/10 bg-gray-900/70 p-8 shadow-2xl shadow-purple-500/10 backdrop-blur-md transition-all duration-300 hover:border-sky-500/50 hover:shadow-[0_0_40px_rgba(56,189,248,0.35)]">
              <p className="text-sm font-semibold uppercase tracking-[0.35rem] text-sky-300">Playful Collabs</p>
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Jump into Scribbly</h2>
              <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
                Bring your ideas to life in our real-time drawing and guessing arena inspired by Skribbl.io. Sketch wild
                prompts, guess faster than your friends, and keep the streak alive across energetic rounds.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/scribble")}
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
                >
                  Play Now
                </button>
                <span className="text-xs uppercase tracking-wide text-slate-400">Instant access · No signup</span>
              </div>
            </div>
            <div className="col-span-2 row-span-3 row-start-3 rounded-2xl border border-white/10 bg-gray-900/60 p-8 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(157,0,255,0.4)]"></div>
            <div className="col-span-3 row-span-3 col-start-3 row-start-3 rounded-2xl border border-white/10 bg-gray-900/60 p-8 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(157,0,255,0.4)]"></div>
          </div>
        </div>
      </section>
      <CreativityContact />
    </>
  );
};

export default Creativity;
