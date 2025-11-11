import React, { useState } from "react";

const Music = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playlists = [
    {
      id: 1,
      title: "Coding Vibes",
      mood: "Focus & Flow",
      color: "from-cyan-500 to-blue-600",
      icon: "💻",
      tracks: 42,
    },
    {
      id: 2,
      title: "Midnight Chill",
      mood: "Ambient & Deep",
      color: "from-purple-500 to-pink-600",
      icon: "🌙",
      tracks: 38,
    },
    {
      id: 3,
      title: "Focus Beats",
      mood: "Productive Energy",
      color: "from-fuchsia-500 to-violet-600",
      icon: "⚡",
      tracks: 51,
    },
  ];

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#0D0B1E] via-[#1a0b2e] to-[#0D0B1E] py-20 px-4 sm:px-[7vw] md:px-[7vw] lg:px-[20vw]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Gradient Blobs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-cyan-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-96 h-96 bg-gradient-to-l from-fuchsia-500/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-gradient-to-br from-purple-500/15 to-transparent rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Floating Sound Wave Lines */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`wave-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
            style={{
              top: `${20 + i * 15}%`,
              left: "0",
              right: "0",
              animation: `wave ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          ></div>
        ))}

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}

        {/* Glowing Rings */}
        <div className="absolute top-1/4 right-1/4 w-48 h-48 border border-purple-500/20 rounded-full animate-ping-slow"></div>
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 border border-cyan-500/20 rounded-full animate-ping-slow delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16 space-y-4">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-500 bg-clip-text text-transparent"
            style={{
              textShadow: "0 0 40px rgba(0, 255, 255, 0.3)",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            In Rhythm With Creativity
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl" style={{ textShadow: "0 0 10px rgba(255, 255, 255, 0.1)" }}>
            Where every beat reflects my imagination.
          </p>
        </div>

        {/* Featured Music Card */}
        <div className="max-w-2xl mx-auto mb-16">
          <div
            className={`relative group bg-white/5 backdrop-blur-lg rounded-3xl p-6 sm:p-8 border transition-all duration-500 ${
              isPlaying ? "border-cyan-400 shadow-[0_0_40px_rgba(0,255,255,0.4)]" : "border-purple-500/30 shadow-[0_0_30px_rgba(157,0,255,0.3)]"
            } hover:scale-105 hover:shadow-[0_0_60px_rgba(255,0,255,0.5)]`}
          >
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              {/* Album Art */}
              <div className="relative flex-shrink-0">
                <div
                  className={`w-48 h-48 rounded-2xl bg-gradient-to-br from-purple-600 via-fuchsia-500 to-cyan-400 flex items-center justify-center text-6xl transition-all duration-300 ${
                    isPlaying ? "animate-pulse" : ""
                  }`}
                >
                  🎵
                </div>
                {/* Equalizer Bars */}
                {isPlaying && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={`eq-${i}`}
                        className="w-1 bg-cyan-400 rounded-full"
                        style={{
                          animation: `equalizer ${0.5 + Math.random() * 0.5}s ease-in-out infinite`,
                          animationDelay: `${i * 0.1}s`,
                          height: "20px",
                        }}
                      ></div>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2" style={{ textShadow: "0 0 20px rgba(255,255,255,0.3)" }}>
                  Creative Symphony
                </h3>
                <p className="text-cyan-300 mb-4">My Featured Playlist</p>
                <p className="text-gray-400 mb-6 text-sm sm:text-base">
                  A curated collection of tracks that fuel my creativity and accompany my development journey.
                </p>

                {/* Play Button */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="group relative px-8 py-3 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full font-semibold text-white shadow-[0_0_20px_rgba(0,255,255,0.5)] hover:shadow-[0_0_40px_rgba(255,0,255,0.8)] transition-all duration-300 hover:scale-110"
                >
                  <span className="flex items-center gap-2">
                    {isPlaying ? "⏸️ Pause" : "▶️ Play"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mood Playlists */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white text-center mb-8" style={{ textShadow: "0 0 20px rgba(255,255,255,0.2)" }}>
            Explore My Moods
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                onMouseEnter={() => setActiveCard(playlist.id)}
                onMouseLeave={() => setActiveCard(null)}
                className={`relative group bg-white/5 backdrop-blur-lg rounded-2xl p-6 border transition-all duration-500 cursor-pointer ${
                  activeCard === playlist.id
                    ? "border-cyan-400 shadow-[0_0_40px_rgba(0,255,255,0.5)] scale-105"
                    : "border-purple-500/20 shadow-[0_0_20px_rgba(157,0,255,0.2)] hover:border-fuchsia-400/40"
                }`}
              >
                {/* Background Glow */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${playlist.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`}
                ></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="text-5xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">{playlist.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2 text-center" style={{ textShadow: "0 0 15px rgba(255,255,255,0.2)" }}>
                    {playlist.title}
                  </h3>
                  <p className="text-cyan-300/80 text-sm text-center mb-4">{playlist.mood}</p>

                  {/* Track Count */}
                  <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                    <span>🎧</span>
                    <span>{playlist.tracks} tracks</span>
                  </div>

                  {/* Floating Equalizer Effect */}
                  {activeCard === playlist.id && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={`mini-eq-${i}`}
                          className="w-0.5 bg-cyan-400 rounded-full"
                          style={{
                            animation: `equalizer ${0.4 + Math.random() * 0.3}s ease-in-out infinite`,
                            animationDelay: `${i * 0.1}s`,
                            height: "12px",
                          }}
                        ></div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="text-center mt-16">
          <p className="text-gray-500 text-sm" style={{ textShadow: "0 0 10px rgba(255,255,255,0.1)" }}>
            Music is the soundtrack to my creative process 🎶
          </p>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes wave {
          0%,
          100% {
            transform: translateY(0px);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-10px);
            opacity: 0.6;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-30px) scale(1.2);
            opacity: 0.8;
          }
        }

        @keyframes equalizer {
          0%,
          100% {
            height: 8px;
          }
          50% {
            height: 20px;
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.1;
          }
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
        }

        .animate-ping-slow {
          animation: ping-slow 4s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
};

export default Music;
