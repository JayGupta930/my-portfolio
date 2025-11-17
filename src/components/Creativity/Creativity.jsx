import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreativityContact from "../../Creativity/Contact/Contact";
import { VaporizeTextCycle } from "../ui/vapour-text-effect";
import Globe from "../ui/globe";

const Creativity = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogLanguage, setDialogLanguage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const openDialog = (language) => {
    setDialogLanguage(language);
    setIsDialogOpen(true);
    setIsMinimized(false);
    setIsMaximized(false);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setDialogLanguage("");
    setIsMinimized(false);
    setIsMaximized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(true);
    setIsDialogOpen(false);
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const restoreDialog = () => {
    setIsDialogOpen(true);
    setIsMinimized(false);
  };

  return (
    <>
      <section
        id="creativity"
        className="relative px-4 font-sans sm:px-[7vw] md:px-[7vw] lg:px-[20vw]"
      >
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-5 grid-rows-4 gap-4">
            <div className="col-span-5 row-span-1 rounded-2xl border border-white/10 bg-gray-900/70 p-8 shadow-2xl shadow-purple-500/10 backdrop-blur-md transition-all duration-300 hover:border-sky-500/50 hover:shadow-[0_0_40px_rgba(56,189,248,0.35)]">
              <div className="h-full flex items-center justify-between">
                <div className="flex justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        Music & Code Vibes
                      </h3>
                      <p className="mt-1 text-sm text-slate-400">
                        Where rhythm meets algorithms
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <button 
                      onClick={() => isMinimized && dialogLanguage === "Hindi" ? restoreDialog() : openDialog("Hindi")}
                      className={`inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300 cursor-pointer hover:bg-purple-500/20 transition-all relative ${
                        isMinimized && dialogLanguage === "Hindi" ? "animate-pulse ring-2 ring-purple-400" : ""
                      }`}
                    >
                      <svg
                        className="h-3 w-3"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                      Hindi
                      {isMinimized && dialogLanguage === "Hindi" && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                        </span>
                      )}
                    </button>
                    <button 
                      onClick={() => isMinimized && dialogLanguage === "Bhojpuri" ? restoreDialog() : openDialog("Bhojpuri")}
                      className={`inline-flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-xs font-medium text-pink-300 cursor-pointer hover:bg-pink-500/20 transition-all relative ${
                        isMinimized && dialogLanguage === "Bhojpuri" ? "animate-pulse ring-2 ring-pink-400" : ""
                      }`}
                    >
                      <svg
                        className="h-3 w-3"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                      
                      Bhojpuri
                      {isMinimized && dialogLanguage === "Bhojpuri" && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                        </span>
                      )}
                    </button>
                  </div>
                </div>
                    <div className="flex items-center justify-center h-full">
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="h-20 w-20 object-contain"
                      >
                        <source src="/video/guitar.webm" type="video/webm" />
                      </video>
                    </div>
              </div>
            </div>
            <div className="col-span-2 row-span-3 row-start-2 rounded-2xl border border-white/10 bg-gray-900/60 p-8 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(157,0,255,0.4)]">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="flex-shrink-0">
                  <Globe />
                </div>
                <div className="mt-6">
                  <VaporizeTextCycle
                    texts={["Creative", "Design", "Ideas"]}
                    font={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "40px",
                      fontWeight: 600,
                    }}
                    color="rgb(255,255, 255)"
                    spread={5}
                    density={5}
                    animation={{
                      vaporizeDuration: 2,
                      fadeInDuration: 1,
                      waitDuration: 0.5,
                    }}
                    direction="left-to-right"
                    alignment="center"
                    tag="h1"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-3 row-span-3 col-start-3 row-start-2 rounded-2xl border border-white/10 bg-gray-900/60 p-8 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(157,0,255,0.4)]">
            </div>
          </div>
        </div>
      </section>

      {/* Dialog Box */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            className={`relative rounded-lg border border-white/20 bg-gray-900/95 shadow-2xl transition-all duration-300 ${
              isMaximized
                ? "h-screen w-screen rounded-none"
                : "h-96 w-[600px]"
            }`}
          >
            {/* Title Bar */}
            <div className="flex items-center justify-between rounded-t-lg border-b border-white/10 bg-gray-800/80 px-4 py-2">
              <h3 className="text-sm font-semibold text-white">
                {dialogLanguage} Music
              </h3>
              <div className="flex items-center gap-2">
                {/* Minimize Button */}
                <button
                  onClick={toggleMinimize}
                  className="group flex h-6 w-6 items-center justify-center rounded hover:bg-yellow-500/20 transition-colors"
                  title="Minimize"
                >
                  <svg
                    className="h-4 w-4 text-yellow-400 group-hover:text-yellow-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                </button>

                {/* Maximize Button */}
                <button
                  onClick={toggleMaximize}
                  className="group flex h-6 w-6 items-center justify-center rounded hover:bg-green-500/20 transition-colors"
                  title="Maximize"
                >
                  {isMaximized ? (
                    <svg
                      className="h-4 w-4 text-green-400 group-hover:text-green-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-4 w-4 text-green-400 group-hover:text-green-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                      />
                    </svg>
                  )}
                </button>

                {/* Close Button */}
                <button
                  onClick={closeDialog}
                  className="group flex h-6 w-6 items-center justify-center rounded hover:bg-red-500/20 transition-colors"
                  title="Close"
                >
                  <svg
                    className="h-4 w-4 text-red-400 group-hover:text-red-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Dialog Content */}
            <div className="p-6 overflow-auto h-[calc(100%-48px)]">
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30">
                  <svg
                    className="h-8 w-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {dialogLanguage} Music Collection
                </h2>
                <p className="text-slate-400 mb-6">
                  Explore your favorite {dialogLanguage} songs
                </p>
                <div className="w-full max-w-md">
                  <div className="rounded-lg border border-white/10 bg-gray-800/50 p-4">
                    <p className="text-sm text-slate-300">
                      Content for {dialogLanguage} music will be displayed here.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10">
        <CreativityContact />
      </div>
    </>
  );
};

export default Creativity;
