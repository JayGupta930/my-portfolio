import { memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero3D from './Hero3D/Hero3D';
import { heroConfig } from './Hero3D/heroConfig';
import motivationalQuotes from './Hero3D/quotes';
import './Hero3D/Hero3D.css';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = ({ introRef }) => {
  const section = useRef(null);
  const traveller = useRef(null);
  const video = useRef(null);
  const backdrop = useRef(null);
  const dialog = useRef(null);
  const progress = useRef({ value: 0, requestFrame: null, active: true });
  const [modelReady, setModelReady] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);

  useEffect(() => {
    const media = gsap.matchMedia();
    const state = progress.current;
    const player = video.current;
    const background = backdrop.current;
    let disposed = false;
    let playPending = false;
    let revealComplete = false;
    let revealEnd = Infinity;

    const shouldPlay = () => !disposed && revealComplete
      && window.scrollY >= revealEnd - 1 && !document.hidden;

    const syncVideo = () => {
      // Preserve the original fade/blur, starting after the portrait handoff.
      const p = Math.min(Math.max((window.scrollY - revealEnd) / 800, 0), 1);
      player.style.setProperty('--video-opacity', String(1 - p * 0.7));
      player.style.filter = `blur(${p * (window.innerWidth < 768 ? 3 : 8)}px)`;
      if (!shouldPlay()) {
        background.dataset.videoActive = 'false';
        player.pause();
        return;
      }
      if (!player.paused) {
        background.dataset.videoActive = 'true';
      } else if (!playPending) {
        playPending = true;
        // Never reset currentTime: scrolling back pauses, then resumes the clip.
        player.play().then(() => {
          if (shouldPlay()) background.dataset.videoActive = 'true';
          else player.pause();
        }).catch(() => {
          // Keep the studio background if the browser blocks playback.
          background.dataset.videoActive = 'false';
        }).finally(() => { playPending = false; });
      }
    };

    const updateReveal = (animation) => {
      const scroll = animation.scrollTrigger;
      if (!scroll) return;
      revealEnd = scroll.end;
      // Wait for scrub damping as well as the user's scroll position.
      revealComplete = animation.progress() >= 0.999 && scroll.progress >= 0.999;
      syncVideo();
    };

    const resetReveal = () => {
      revealComplete = false;
      revealEnd = Infinity;
      syncVideo();
    };
    const observer = new IntersectionObserver(([entry]) => {
      state.active = entry.isIntersecting;
      if (state.active) state.requestFrame?.();
    });
    observer.observe(section.current.parentElement);

    // Also update after the scrub timeline has ended (and on reverse scrolling).
    const videoScroll = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: syncVideo,
    });
    document.addEventListener('visibilitychange', syncVideo);
    resetReveal();

    media.add('(min-width: 1024px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)', () => {
      state.value = 0;
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        onUpdate() { updateReveal(this); },
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          endTrigger: introRef.current,
          end: 'bottom bottom',
          pin: traveller.current,
          pinSpacing: false,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: ({ animation }) => updateReveal(animation),
        },
      });
      timeline.to(state, {
        value: 1,
        duration: 1,
        onUpdate: () => { if (state.active) state.requestFrame?.(); },
      }, 0);
      timeline.to('.hero3d-copy--left', { x: -16, y: -20, duration: 1 }, 0);
      timeline.to('.hero3d-copy--right', { x: 12, y: 16, duration: 1 }, 0);
      timeline.to('.hero3d-progress span', { scaleX: 1, duration: 1 }, 0);
      timeline.fromTo('.hero3d-visual', { xPercent: 7, scale: 0.78 }, { xPercent: 0, scale: 1, duration: 0.9 }, 0);
      if (!modelReady) {
        // A generated rear photograph and the original front form a two-sided image.
        timeline.fromTo('.hero3d-portrait', { rotationY: 180 }, { rotationY: 0, duration: 0.9 }, 0);
      }
      return () => {
        resetReveal();
        state.value = 0;
        state.requestFrame?.();
      };
    }, section);

    media.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference), (max-height: 599px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.hero3d-portrait', { rotationY: 180 }, {
        rotationY: 0,
        ease: 'none',
        onUpdate() { updateReveal(this); },
        scrollTrigger: {
          trigger: traveller.current,
          start: 'top 90%',
          end: 'center 55%',
          scrub: 0.65,
          invalidateOnRefresh: true,
          onRefresh: ({ animation }) => updateReveal(animation),
        },
      });
      return resetReveal;
    }, section);

    media.add('(prefers-reduced-motion: reduce)', () => {
      const updateStaticReveal = (scroll) => {
        revealEnd = scroll.end;
        revealComplete = scroll.progress >= 0.999;
        syncVideo();
      };
      ScrollTrigger.create({
        trigger: section.current,
        start: 'top top',
        endTrigger: introRef.current,
        end: 'bottom bottom',
        onUpdate: updateStaticReveal,
        onRefresh: updateStaticReveal,
      });
      return resetReveal;
    }, section);

    let mounted = true;
    document.fonts?.ready.then(() => { if (mounted) ScrollTrigger.refresh(); });
    return () => {
      mounted = false;
      disposed = true;
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncVideo);
      videoScroll.kill();
      media.revert();
      player.pause();
      background.dataset.videoActive = 'false';
    };
  }, [modelReady, introRef]);

  const showQuote = () => {
    setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    dialog.current.showModal();
  };

  return (
    <section ref={section} className="cinematic-hero" aria-label="Creative pulse — Jay Gupta">
      <div ref={backdrop} className="hero3d-backdrop" data-video-active="false" aria-hidden="true">
        <div className="hero3d-studio" />
        <video ref={video} className="hero3d-video" muted loop playsInline preload="metadata">
          <source src="/video/hero-3.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="hero3d-stage">
        <div className="hero3d-atmosphere" aria-hidden="true" />
        <div className="hero3d-copy hero3d-copy--left">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-white text-opacity-70">Creative pulse</p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-white leading-tight">Stories spark lasting momentum</h2>
          <p className="mt-3 text-sm sm:text-base text-white text-opacity-80 leading-6">I craft immersive digital narratives that help daring ideas take flight.</p>
        </div>

        <div className="hero3d-copy hero3d-copy--right">
          <p className="text-xs font-semibold tracking-[0.35em] uppercase text-white text-opacity-70">Vision in motion</p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-white leading-tight">Where curiosity fuels crafted experiences</h2>
          <p className="mt-3 text-sm sm:text-base text-white text-opacity-80 leading-6">Dive into interactive experiments that showcase the playful heart of my craft.</p>
          <div className="hero3d-cta mt-6 inline-flex justify-end w-full">
            <Link to="/creativity" className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 py-2 text-sm font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:bg-white hover:text-black hover:border-white">
              Explore Creativity <span aria-hidden="true" className="text-lg leading-none">→</span>
            </Link>
          </div>
        </div>

        <button type="button" onClick={showQuote} className="hero3d-quote-trigger px-3 py-5 bg-[#999193] text-white uppercase tracking-[0.28em] text-[11px] font-semibold rotate-180 origin-center shadow-lg transition-colors duration-300 hover:bg-[#ff476d]" aria-label="Show motivational quote">
          Code spark of the day
        </button>

        <div className="hero3d-scroll-cue">
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden="true"><path d="M6 1v16m-4-4 4 4 4-4" stroke="currentColor" /></svg>
          <span>Scroll to reveal</span>
          <div className="hero3d-progress" aria-hidden="true"><span /></div>
        </div>
      </div>

      <div ref={traveller} className="hero3d-traveller">
        <Hero3D {...heroConfig} progress={progress} onReady={setModelReady} />
      </div>

      <dialog ref={dialog} className="hero3d-dialog" aria-labelledby="hero-quote-title" data-lenis-prevent onClick={(event) => { if (event.target === dialog.current) dialog.current.close(); }}>
        <p id="hero-quote-title" className="text-xs uppercase tracking-[0.4em] text-white/60">Stay curious</p>
        <p className="mt-6 font-serif text-3xl leading-[1.35]">{currentQuote}</p>
        <button type="button" autoFocus onClick={() => dialog.current.close()} className="mt-10 inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-white transition-colors duration-300 hover:bg-white hover:text-black">Close</button>
      </dialog>
    </section>
  );
};

export default memo(HeroSection);
