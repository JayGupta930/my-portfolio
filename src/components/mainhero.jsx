import React, { useEffect, useRef, useState } from 'react';

const motivationalQuotes = [
  "Code is the canvas where ideas become alive.",
  "Every bug fixed is a lesson learned.",
  "Great software is built one commit at a time.",
  "In the world of code, curiosity is your superpower.",
  "The best code is the one that tells a story.",
  "Debug your doubts, compile your dreams.",
  "Innovation starts with a single line of code.",
  "Code with passion, deploy with confidence.",
  "Every expert was once a beginner who never gave up.",
  "Your code today shapes tomorrow's possibilities.",
  "Simplicity is the ultimate sophistication in coding.",
  "Think twice, code once.",
  "The keyboard is mightier than the sword.",
  "Transform coffee into code, and code into magic.",
  "Learning to code is learning to create.",
  "Embrace the errors, they are your greatest teachers.",
  "Code is poetry written for machines to dance.",
  "Build something that matters, one function at a time.",
  "The only way to do great work is to love what you code.",
  "Stay hungry, stay foolish, keep coding.",
  "Your potential is limitless, just like an infinite loop.",
  "Dream in code, wake up and build.",
  "Every masterpiece starts with a blank editor.",
  "Code like nobody's watching, ship like everybody is.",
  "The future belongs to those who code it.",
];

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isQuoteVisible, setIsQuoteVisible] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);
  const videoRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const scrollProgress = Math.min(scrollY / 800, 1);
  const videoOpacity = 1 - scrollProgress * 0.7;
  const videoBlur = scrollProgress * 8;
  const contentOpacity = 1 - Math.pow(scrollProgress, 1.5) * 1.2;
  const contentTranslateY = scrollProgress * 100;
  const contentScale = 1 - scrollProgress * 0.1;
  const showQuoteButton = scrollProgress < 0.25;

  return (
    <div className="relative pt-48 pb-12 h-screen bg-black xl:pt-60 sm:pb-16 lg:pb-32 xl:pb-48 2xl:pb-56 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <video
          ref={videoRef}
          className="object-cover w-full h-full fixed top-0 left-0 pointer-events-none"
          style={{
            opacity: videoOpacity,
            filter: `blur(${videoBlur}px)`,
            transition: 'opacity 300ms ease-out, transform 300ms ease-out, filter 300ms ease-out',
            objectPosition: '40% center',
          }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/video/alternate.png"
          aria-hidden="true"
        >
          <source src="/video/hero-3.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, transparent 60%, #020714 100%)',
          }}
        />

        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020714]"
          style={{
            opacity: scrollProgress * 0.8,
            transition: 'opacity 300ms ease-out',
          }}
        />

        < div
          className="absolute inset-0 bg-gradient-to-br from-[#0a1025]/60 via-transparent to-[#1a0331]/70 pointer-events-none"
          style={{
            mixBlendMode: 'multiply',
          }}
        />

        < div
          className="absolute top-16 left-8 sm:top-20 sm:left-16 max-w-xs text-left pointer-events-none"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-15px)',
            transition: 'opacity 900ms cubic-bezier(0.4, 0, 0.2, 1) 150ms, transform 900ms cubic-bezier(0.4, 0, 0.2, 1) 150ms',
          }}
        >
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-white text-opacity-70">
            Creative pulse
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-white leading-tight">
            Stories spark lasting momentum
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white text-opacity-80 leading-6">
            I craft immersive digital narratives that help daring ideas take flight.
          </p>
        </div >

        <div
          className="absolute bottom-16 right-8 sm:bottom-20 sm:right-16 max-w-sm text-right pointer-events-none"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 900ms cubic-bezier(0.4, 0, 0.2, 1) 200ms, transform 900ms cubic-bezier(0.4, 0, 0.2, 1) 200ms',
          }}
        >
          <p className="text-xs font-semibold tracking-[0.35em] uppercase text-white text-opacity-70">
            Vision in motion
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-white leading-tight">
            Where curiosity fuels crafted experiences
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white text-opacity-80 leading-6">
            Dive into interactive experiments that showcase the playful heart of my craft.
          </p>
          <div className="mt-6 inline-flex justify-end pointer-events-auto">
            <a
              href="/creativity"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 py-2 text-sm font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:bg-white hover:text-black hover:border-white"
            >
              Explore Creativity
              <span aria-hidden="true" className="text-lg leading-none">
                →
              </span>
            </a>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
          setCurrentQuote(motivationalQuotes[randomIndex]);
          setIsQuoteVisible(true);
        }}
        className={`fixed right-0 px-3 py-5 bg-[#999193] text-white uppercase tracking-[0.28em] text-[11px] font-semibold rotate-180 origin-center shadow-lg transition-all duration-300 hover:bg-[#ff476d] ${showQuoteButton ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ writingMode: 'vertical-rl', top: '20%' }}
        aria-label="Show motivational quote"
      >
        Code spark of the day
      </button>

      {isQuoteVisible && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setIsQuoteVisible(false)}
        >
          <div
            className="mx-6 max-w-lg rounded-3xl border border-white/20 bg-white/5 px-10 py-12 text-center text-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Stay curious</p>
            <p className="mt-6 font-serif text-3xl leading-[1.35]">{currentQuote}</p>
            <button
              type="button"
              onClick={() => setIsQuoteVisible(false)}
              className="mt-10 inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-white transition-colors duration-300 hover:bg-white hover:text-black"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10">
        <div className="px-6 mx-auto sm:px-8 lg:px-12 max-w-7xl">
          <div
            className="w-full flex flex-col items-center text-center mt-[-40px]"
            style={{
              opacity: contentOpacity,
              transform: `translateY(${contentTranslateY}px) scale(${contentScale})`,
              transition: 'opacity 200ms ease-out, transform 200ms ease-out',
            }}
          >
            {/* <h1
              className="font-sans text-base font-normal text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 text-opacity-70"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 1200ms cubic-bezier(0.4, 0, 0.2, 1) 200ms, transform 1200ms cubic-bezier(0.4, 0, 0.2, 1) 200ms',
              }}
            >
              Turning vision into momentum
            </h1> */}

            {/* <p
              className="mt-6"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 1400ms cubic-bezier(0.4, 0, 0.2, 1) 400ms, transform 1400ms cubic-bezier(0.4, 0, 0.2, 1) 400ms',
              }}
            >
              <span className="font-sans font-normal text-7xl text-white">The road to the</span>
              <br />
              <span className="font-serif italic font-normal text-8xl text-white">perfect loaf</span>
            </p> */}

            {/* <p
              className="mt-12 font-sans text-base font-normal leading-7 text-white text-opacity-70 max-w-2xl"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 1400ms cubic-bezier(0.4, 0, 0.2, 1) 600ms, transform 1400ms cubic-bezier(0.4, 0, 0.2, 1) 600ms',
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eu penatibus
              pellentesque dolor consequat ligula egestas massa gravida. Porttitor
              venenatis enim praesent.
            </p> */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;