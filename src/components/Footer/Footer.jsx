import React, { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";

const WallClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDeg = (hours * 30) + (minutes * 0.5);
  const minuteDeg = (minutes * 6) + (seconds * 0.1);
  const secondDeg = seconds * 6;

  return (
    <div className="relative w-24 h-24 rounded-full border-2 border-gray-700 bg-[#0A0A0A] flex items-center justify-center flex-shrink-0">
      {/* Clock face markers */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 h-2 bg-gray-500"
          style={{
            transform: `rotate(${i * 30}deg) translateY(-40px)`,
          }}
        />
      ))}
      {/* Hour hand */}
      <div
        className="absolute w-1 h-6 bg-white rounded-full origin-bottom"
        style={{
          transform: `rotate(${hourDeg}deg)`,
          bottom: '50%',
        }}
      />
      {/* Minute hand */}
      <div
        className="absolute w-0.5 h-8 bg-gray-300 rounded-full origin-bottom"
        style={{
          transform: `rotate(${minuteDeg}deg)`,
          bottom: '50%',
        }}
      />
      {/* Second hand */}
      <div
        className="absolute w-[1px] h-9 bg-[#8245ec] rounded-full origin-bottom"
        style={{
          transform: `rotate(${secondDeg}deg)`,
          bottom: '50%',
        }}
      />
      {/* Center dot */}
      <div className="absolute w-2 h-2 bg-[#8245ec] rounded-full" />
    </div>
  );
};

const Footer = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { name: "About", path: "/" },
    { name: "Skills", path: "/skills" },
    { name: "Projects", path: "/projects" },
    { name: "Education", path: "/education" },
    { name: "Experience", path: "/experience" },
    { name: "Contact", path: "/contact" },
  ];

  const socialLinks = [
    { icon: <FaLinkedin size={18} />, link: "https://www.linkedin.com/in/jaygupta930", label: "LinkedIn" },
    { icon: <FaGithub size={18} />, link: "https://github.com/JayGupta930", label: "GitHub" },
    { icon: <FaTwitter size={18} />, link: "https://x.com/JayGupta930", label: "Twitter" },
  ];

  return (
    <footer className="bg-[#0A0A0A] text-white">
      {/* Main Footer Content */}
      <div className="px-6 sm:px-12 lg:px-24 py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
            
            {/* Brand Area */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative inline-block">
                <h2 
                  className="text-3xl sm:text-4xl font-bold tracking-tight text-white"
                  style={{
                    textShadow: '0 0 40px rgba(255, 255, 255, 0.15), 0 0 80px rgba(255, 255, 255, 0.05)'
                  }}
                >
                  Jay Gupta
                </h2>
                <div 
                  className="absolute -inset-4 -z-10 rounded-2xl opacity-50"
                  style={{
                    boxShadow: '0 0 60px rgba(255, 255, 255, 0.08)'
                  }}
                />
              </div>
              <p className="text-gray-400 text-base sm:text-lg font-light max-w-sm leading-relaxed">
                Crafting digital experiences that blend innovation with elegance.
              </p>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-4">
              <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mb-6">
                Quick Links
              </h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {quickLinks.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(item.path)}
                    className="text-left text-gray-300 hover:text-[#8245ec] text-sm sm:text-base font-medium transition-all duration-300 ease-out hover:translate-x-1 cursor-pointer"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Social Section */}
            <div className="lg:col-span-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mb-6">
                    Connect
                  </h3>
                  <div className="flex gap-4">
                    {socialLinks.map((item, index) => (
                      <a
                        key={index}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={item.label}
                        className="w-11 h-11 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-[#8245ec] hover:border-[#8245ec] transition-all duration-300 ease-out hover:scale-110 hover:rotate-6 cursor-pointer"
                      >
                        {item.icon}
                      </a>
                    ))}
                  </div>
                </div>
                <WallClock />
              </div>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);