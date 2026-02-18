import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreativityContact from "../../Creativity/Contact/Contact";
import VaporizeTextCycle from "../ui/vapour-text-effect";
import Globe from "../ui/globe";
import ScrollReveal from "../ScrollReveal";

const Creativity = () => {
  const navigate = useNavigate();
  
  // Typing animation states
  const [displayedText, setDisplayedText] = useState("");
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(true);

  const codingQuotes = [
    { text: "console.log('Hello, World!');", lang: "JavaScript" },
    { text: "print('Code is poetry')", lang: "Python" },
    { text: "System.out.println(\"Dream big\");", lang: "Java" },
    { text: "<div>Build the future</div>", lang: "HTML" },
    { text: "SELECT * FROM dreams;", lang: "SQL" },
    { text: "echo 'Never stop learning';", lang: "PHP" },
    { text: "puts 'Elegance matters'", lang: "Ruby" },
    { text: "fn main() { think_different(); }", lang: "Rust" },
  ];

  // Typing effect
  useEffect(() => {
    const currentQuote = codingQuotes[currentQuoteIndex].text;
    
    if (isTyping) {
      if (displayedText.length < currentQuote.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(currentQuote.slice(0, displayedText.length + 1));
        }, 80);
        return () => clearTimeout(timeout);
      } else {
        // Pause at end before deleting
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (displayedText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, 40);
        return () => clearTimeout(timeout);
      } else {
        // Move to next quote
        setCurrentQuoteIndex((prev) => (prev + 1) % codingQuotes.length);
        setIsTyping(true);
      }
    }
  }, [displayedText, isTyping, currentQuoteIndex]);

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <>
      <section
        id="creativity"
        className="relative px-3 sm:px-4 font-sans md:px-[7vw] lg:px-[20vw]"
      >
        <div className="mx-auto max-w-5xl mt-20 sm:mt-20 pt-6 sm:pt-0">
          <div className="flex flex-col gap-3 sm:gap-4 lg:grid lg:grid-cols-5">
            {/* Live Code Typing Card - Replaced Music Card */}
            <div className="rounded-2xl border border-white/10 bg-gray-900/70 p-4 sm:p-6 lg:p-8 shadow-2xl shadow-purple-500/10 backdrop-blur-md transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_0_40px_rgba(16,185,129,0.35)] lg:col-span-5">
              <div className="h-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                <div className="flex flex-col sm:flex-row justify-between w-full gap-4 sm:gap-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-emerald-500/20 shadow-lg shadow-emerald-500/30 flex-shrink-0">
                      <svg
                        className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                        Live Code Terminal
                      </h3>
                      <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-400">
                        Watch the code come alive
                      </p>
                    </div>
                  </div>
                  
                  {/* Terminal Window */}
                  <div className="flex-1 sm:ml-6 w-full sm:max-w-md">
                    <div className="rounded-lg border border-white/10 bg-gray-950/80 overflow-hidden">
                      {/* Terminal Header */}
                      <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-800/50 border-b border-white/5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                        <span className="ml-2 text-[10px] sm:text-xs text-slate-500 font-mono">
                          {codingQuotes[currentQuoteIndex].lang}
                        </span>
                      </div>
                      {/* Terminal Body */}
                      <div className="px-3 py-3 sm:py-4 font-mono text-sm sm:text-base">
                        <span className="text-emerald-400">❯ </span>
                        <span className="text-cyan-300">{displayedText}</span>
                        <span className={`inline-block w-2 h-4 sm:h-5 bg-emerald-400 ml-0.5 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Globe Card */}
            <div className="rounded-2xl border border-white/10 bg-gray-900/60 p-4 sm:p-6 lg:p-8 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(157,0,255,0.4)] min-h-[350px] sm:min-h-[380px] lg:min-h-0 lg:col-span-2 lg:row-span-3 lg:row-start-2">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="flex-shrink-0 scale-75 sm:scale-90 lg:scale-100 mx-auto">
                  <Globe />
                </div>
                <div className="mt-6 sm:mt-6 w-full h-20 sm:h-16 flex items-center justify-center text-center" style={{ minHeight: '80px' }}>
                  <VaporizeTextCycle
                    texts={["Cool", "Design", "Ideas"]}
                    font={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "50px",
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
            {/* Empty Card */}
            <div className="rounded-2xl border border-white/10 bg-gray-900/60 p-4 sm:p-6 lg:p-8 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(157,0,255,0.4)] min-h-[200px] sm:min-h-[280px] lg:min-h-0 flex items-center justify-center overflow-hidden lg:col-span-3 lg:row-span-3 lg:col-start-3 lg:row-start-2">
              <div className="w-full h-full flex items-center justify-center px-2 sm:px-4">
                <ScrollReveal
                  baseOpacity={0}
                  enableBlur={true}
                  baseRotation={5}
                  blurStrength={10}
                  containerClassName="creativity-scroll-reveal"
                  textClassName="creativity-scroll-text"
                  rotationEnd="top top"
                  wordAnimationEnd="top top"
                >
                  When does a man die? When he is hit by a bullet? No! When he suffers a disease? No! When he ate a soup made out of a poisonous mushroom? No! A man dies when he is forgotten!
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-10">
        <CreativityContact />
      </div>
    </>
  );
};

export default Creativity;
