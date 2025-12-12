import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import Game2048 from './2048/Game2048';
import TicTacToe from './TicTacToe/Tic';

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '132, 0, 255';
const MOBILE_BREAKPOINT = 768;

const cardData = [
  {
    color: '#060010',
    title: 'Profile',
    description: 'FSD @ilika.earth | Ex-UI/UX @Solysian Tech Private Limited | Full-Stack Developer (MERN) | React & Next.js Specialist | UI/UX Designer | JLPT N2 Prep (Aiming for Tech Roles in Japan)',
    label: 'Linkedin',
    link: 'https://www.linkedin.com/in/jay-gupta-930/'
  },
  {
    color: '#060010',
    title: 'X (Twitter)',
    description: 'I specialize in translating ideas into well-crafted digital experiences, using React for dynamic interfaces and UI/UX design to shape smooth user journeys.',
    label: 'X',
    link: 'https://x.com/JayGupta930/'
  },
  {
    color: '#060010',
    title: 'Fun',
    description: 'I enjoy solving puzzles and playing games like chess and 2048 during my free time to unwind and challenge my mind.',
    label: '2048'
  },
  {
    color: '#060010',
    title: 'Automation',
    description: 'Streamline workflows',
    label: 'Efficiency'
  },
  {
    color: '#060010',
    title: 'Instagram',
    description: 'ジェイ',
    label: 'Instagram',
    link: 'https://www.instagram.com/jaygupta7774/',
    showFollowers: true
  },
  {
    color: '#060010',
    title: 'GitHub',
    description: 'Building stuff I shouldn\'t be building at 3 AM.\nDesigning like an artist.\n Coding like a machine.\nMERN | React | UI/UX | Controlled madness.',
    label: 'GitHub',
    link: 'https://github.com/JayGupta930'
  }
];

const createParticleElement = (x, y, color = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = radius => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75
});

const updateCardGlowProperties = (card, mouseX, mouseY, glow, radius) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

const ParticleCard = ({
  children,
  className = '',
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false
}) => {
  const cardRef = useRef(null);
  const particlesRef = useRef([]);
  const timeoutsRef = useRef([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef(null);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor)
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();

    particlesRef.current.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        }
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true);
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });

        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true
        });

        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true
        });
      }, index * 100);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }

      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const handleMouseMove = e => {
      if (!enableTilt && !enableMagnetism) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.05;
        const magnetY = (y - centerY) * 0.05;

        magnetismAnimationRef.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const handleClick = e => {
      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;

      element.appendChild(ripple);

      gsap.fromTo(
        ripple,
        {
          scale: 0,
          opacity: 1
        },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => ripple.remove()
        }
      );
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);

  return (
    <div
      ref={cardRef}
      className={`${className} relative overflow-hidden`}
      style={{ ...style, position: 'relative', overflow: 'hidden' }}
    >
      {children}
    </div>
  );
};

const GlobalSpotlight = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR
}) => {
  const spotlightRef = useRef(null);
  const isInsideSection = useRef(false);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = e => {
      if (!spotlightRef.current || !gridRef.current) return;

      const section = gridRef.current.closest('.bento-section');
      const rect = section?.getBoundingClientRect();
      const mouseInside =
        rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

      isInsideSection.current = mouseInside || false;
      const cards = gridRef.current.querySelectorAll('.card');

      if (!mouseInside) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
        cards.forEach(card => {
          card.style.setProperty('--glow-intensity', '0');
        });
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cards.forEach(card => {
        const cardElement = card;
        const cardRect = cardElement.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(cardElement, e.clientX, e.clientY, glowIntensity, spotlightRadius);
      });

      gsap.to(spotlightRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });

      const targetOpacity =
        minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
            : 0;

      gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      isInsideSection.current = false;
      gridRef.current?.querySelectorAll('.card').forEach(card => {
        card.style.setProperty('--glow-intensity', '0');
      });
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

const BentoCardGrid = ({ children, gridRef }) => (
  <div
    className="bento-section grid gap-2 p-3 max-w-[90rem] select-none relative"
    style={{ 
      fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.5rem)',
      margin: '0 auto'
    }}
    ref={gridRef}
  >
    {children}
  </div>
);

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

const MagicBento = ({
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true
}) => {
  const gridRef = useRef(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;
  const [followerCount, setFollowerCount] = useState(null);

  useEffect(() => {
    const fetchInstagramFollowers = async () => {
      try {
        const response = await fetch('https://www.instagram.com/jaygupta7774/?__a=1&__d=dis');
        const data = await response.json();
        const followers = data?.graphql?.user?.edge_followed_by?.count;
        if (followers) {
          setFollowerCount(followers.toLocaleString());
        }
      } catch (error) {
        console.log('Could not fetch Instagram followers');
        setFollowerCount('View Profile');
      }
    };
    fetchInstagramFollowers();
  }, []);

  return (
    <>
      <style>
        {`
          .bento-section {
            --glow-x: 50%;
            --glow-y: 50%;
            --glow-intensity: 0;
            --glow-radius: 200px;
            --glow-color: ${glowColor};
            --border-color: #392e4e;
            --background-dark: #060010;
            --white: hsl(0, 0%, 100%);
            --purple-primary: rgba(132, 0, 255, 1);
            --purple-glow: rgba(132, 0, 255, 0.2);
            --purple-border: rgba(132, 0, 255, 0.8);
          }
          
          .card-responsive {
            display: grid;
            grid-template-columns: 1fr;
            width: 95%;
            max-width: 100%;
            margin: 0 auto;
            padding: 0.5rem;
            gap: 0.75rem;
          }
          
          .card-responsive .card {
            width: 100%;
            min-height: 180px;
            aspect-ratio: auto;
          }
          
          @media (min-width: 480px) {
            .card-responsive {
              width: 92%;
              gap: 0.75rem;
            }
            
            .card-responsive .card {
              // min-height: 200px;
              min-height: -webkit-fill-available;
            }
          }
          
          @media (min-width: 600px) {
            .card-responsive {
              grid-template-columns: repeat(2, 1fr);
              width: 90%;
              gap: 1rem;
            }
            
            .card-responsive .card {
              // min-height: 220px;
              min-height: -webkit-fill-available;
            }
          }
          
          @media (min-width: 768px) {
            .card-responsive {
              grid-template-columns: repeat(2, 1fr);
              width: 88%;
              gap: 1rem;
            }
            
            .card-responsive .card {
              // min-height: 240px;
              min-height: -webkit-fill-available;
            }
          }
          
          @media (min-width: 1024px) {
            .card-responsive {
              grid-template-columns: repeat(4, 1fr);
              width: 90%;
              gap: 0.5rem;
            }
            
            .card-responsive .card {
              min-height: -webkit-fill-available;
            }
            
            .card-responsive .card:nth-child(3) {
              grid-column: span 2;
              grid-row: span 2;
            }
            
            .card-responsive .card:nth-child(4) {
              grid-column: 1 / span 2;
              grid-row: 2 / span 2;
            }
            
            .card-responsive .card:nth-child(6) {
              grid-column: 4;
              grid-row: 3;
            }
          }
          
          @media (min-width: 1280px) {
            .card-responsive {
              width: 85%;
              max-width: 90rem;
            }
          }
          
          .card--border-glow::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 6px;
            background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.8)) 0%,
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.4)) 30%,
                transparent 60%);
            border-radius: inherit;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: subtract;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 1;
          }
          
          .card--border-glow:hover::after {
            opacity: 1;
          }
          
          .card--border-glow:hover {
            border: 1px solid transparent;
            background: 
              linear-gradient(#060010, #060010) padding-box,
              linear-gradient(180deg, #6b21a8 0%, #a855f7 20%, #c084fc 40%, #67e8f9 60%, #22d3ee 80%, #a78bfa 100%) border-box;
            box-shadow: 0 4px 20px rgba(46, 24, 78, 0.4), 0 0 30px rgba(${glowColor}, 0.2);
          }
          
          .particle::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: rgba(${glowColor}, 0.2);
            border-radius: 50%;
            z-index: -1;
          }
          
          .particle-container:hover {
            box-shadow: 0 4px 20px rgba(46, 24, 78, 0.2), 0 0 30px rgba(${glowColor}, 0.2);
          }
          
          .text-clamp-1 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .text-clamp-2 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          /* Mobile-specific card styling */
          @media (max-width: 479px) {
            .card-responsive {
              grid-template-columns: 1fr;
              width: 95%;
              margin: 0 auto;
              padding: 0.25rem;
              gap: 0.5rem;
            }
            
            .card-responsive .card {
              width: 100%;
              min-height: 160px;
              padding: 1rem !important;
              aspect-ratio: auto;
            }
            
            .card-responsive .card .card__header {
              margin-bottom: 0.5rem;
            }
            
            .card-responsive .card .card__header img {
              width: 2.5rem;
              height: 2.5rem;
            }
            
            .card-responsive .card .card__label {
              font-size: 0.875rem;
            }
            
            .card-responsive .card .card__title {
              font-size: 1rem;
            }
            
            .card-responsive .card .card__description {
              font-size: 0.7rem;
              -webkit-line-clamp: 3;
              line-clamp: 3;
            }
          }
          
          @media (max-width: 599px) and (min-width: 480px) {
            .card-responsive {
              grid-template-columns: 1fr;
              width: 92%;
              margin: 0 auto;
              padding: 0.5rem;
            }
            
            .card-responsive .card {
              width: 100%;
              min-height: 180px;
            }
            
            .card-responsive .card .card__header img {
              width: 3rem;
              height: 3rem;
            }
          }
          
          /* Tablet portrait adjustments */
          @media (min-width: 600px) and (max-width: 767px) {
            .card-responsive .card .card__description {
              font-size: 0.75rem;
              -webkit-line-clamp: 3;
              line-clamp: 3;
            }
          }
          
          /* Touch device optimizations */
          @media (hover: none) and (pointer: coarse) {
            .card-responsive .card {
              touch-action: manipulation;
            }
            
            .card-responsive .card:active {
              transform: scale(0.98);
              transition: transform 0.1s ease;
            }
          }
        `}
      </style>

      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <BentoCardGrid gridRef={gridRef}>
        <div className="card-responsive grid gap-2">
          {cardData.map((card, index) => {
            const isGameCard = index === 2 || index === 3;
            const GameComponent = isGameCard ? (index === 2 ? Game2048 : TicTacToe) : null;
            const baseClassName = [
              'card flex flex-col justify-between relative aspect-[4/3] min-h-[200px] w-full max-w-full rounded-[20px] border border-solid font-light overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)]',
              enableBorderGlow ? 'card--border-glow' : '',
              isGameCard ? 'p-0' : 'p-5'
            ].filter(Boolean).join(' ');

            const cardStyle = {
              backgroundColor: card.color || 'var(--background-dark)',
              borderColor: 'var(--border-color)',
              color: 'var(--white)',
              '--glow-x': '50%',
              '--glow-y': '50%',
              '--glow-intensity': '0',
              '--glow-radius': '200px'
            };

            const gameCardContent = isGameCard ? (
              <div className="h-full w-full p-3 sm:p-4 flex flex-col">
                <div className="flex-1 min-h-0">
                  {GameComponent && <GameComponent embedded />}
                </div>
              </div>
            ) : null;

            if (enableStars) {
              const CardContent = isGameCard ? (
                gameCardContent
              ) : (
                <>
                  <div className="card__header flex justify-between items-start gap-2 relative text-white mb-4">
                    <span className="card__label text-base">{card.label}</span>
                    {index === 0 && (
                      <img 
                        src="/img/Profile.jpg" 
                        alt="Profile" 
                        className="w-14 h-14 rounded-full object-cover border-2 border-purple-500/30 shadow-lg flex-shrink-0"
                      />
                    )}
                    {index === 1 && (
                      <img 
                        src="/img/x.jpg" 
                        alt="X Profile" 
                        className="w-14 h-14 rounded-full object-cover border-2 border-purple-500/30 shadow-lg flex-shrink-0"
                      />
                    )}
                    {index === 4 && (
                      <img 
                        src="/img/insta.jpg" 
                        alt="Instagram Profile" 
                        className="w-14 h-14 rounded-full object-cover border-2 border-purple-500/30 shadow-lg flex-shrink-0"
                      />
                    )}
                    {index === 5 && (
                      <img 
                        src="/img/github.jpg" 
                        alt="GitHub Profile" 
                        className="w-14 h-14 rounded-full object-cover border-2 border-purple-500/30 shadow-lg flex-shrink-0"
                      />
                    )}
                  </div>
                  <div className="card__content flex flex-col relative text-white mt-auto gap-2">
                    <h3 className={`card__title font-semibold text-xl m-0 ${(index === 0 || index === 1 || index === 5) ? '' : textAutoHide ? 'text-clamp-1' : ''}`}>
                      {card.title}
                    </h3>
                    <p
                      className={`card__description text-xs leading-relaxed opacity-90 ${(index === 0 || index === 1 || index === 5) ? '' : textAutoHide ? 'text-clamp-2' : ''}`}
                      style={(index === 0 || index === 1 || index === 5) ? { display: '-webkit-box', WebkitLineClamp: 6, WebkitBoxOrient: 'vertical', overflow: 'hidden', whiteSpace: 'pre-line' } : {}}
                    >
                      {card.description}
                    </p>
                    {index === 4 && card.showFollowers && followerCount && (
                      <p className="text-sm font-semibold opacity-80 mt-1">
                        {followerCount} followers
                      </p>
                    )}
                  </div>
                </>
              );

              if (index === 0 && card.link) {
                return (
                  <a
                    key={index}
                    href={card.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block no-underline"
                    style={{ cursor: 'pointer' }}
                  >
                    <ParticleCard
                      className={baseClassName}
                      style={cardStyle}
                      disableAnimations={shouldDisableAnimations}
                      particleCount={particleCount}
                      glowColor={glowColor}
                      enableTilt={isGameCard ? false : enableTilt}
                      clickEffect={isGameCard ? false : clickEffect}
                      enableMagnetism={isGameCard ? false : enableMagnetism}
                    >
                      {CardContent}
                    </ParticleCard>
                  </a>
                );
              }

              if (index === 1 && card.link) {
                return (
                  <a
                    key={index}
                    href={card.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block no-underline"
                    style={{ cursor: 'pointer' }}
                  >
                    <ParticleCard
                      className={baseClassName}
                      style={cardStyle}
                      disableAnimations={shouldDisableAnimations}
                      particleCount={particleCount}
                      glowColor={glowColor}
                      enableTilt={isGameCard ? false : enableTilt}
                      clickEffect={isGameCard ? false : clickEffect}
                      enableMagnetism={isGameCard ? false : enableMagnetism}
                    >
                      {CardContent}
                    </ParticleCard>
                  </a>
                );
              }

              if (index === 4 && card.link) {
                return (
                  <a
                    key={index}
                    href={card.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block no-underline"
                    style={{ cursor: 'pointer' }}
                  >
                    <ParticleCard
                      className={baseClassName}
                      style={cardStyle}
                      disableAnimations={shouldDisableAnimations}
                      particleCount={particleCount}
                      glowColor={glowColor}
                      enableTilt={isGameCard ? false : enableTilt}
                      clickEffect={isGameCard ? false : clickEffect}
                      enableMagnetism={isGameCard ? false : enableMagnetism}
                    >
                      {CardContent}
                    </ParticleCard>
                  </a>
                );
              }

              if (index === 5 && card.link) {
                return (
                  <a
                    key={index}
                    href={card.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block no-underline"
                    style={{ cursor: 'pointer' }}
                  >
                    <ParticleCard
                      className={baseClassName}
                      style={cardStyle}
                      disableAnimations={shouldDisableAnimations}
                      particleCount={particleCount}
                      glowColor={glowColor}
                      enableTilt={isGameCard ? false : enableTilt}
                      clickEffect={isGameCard ? false : clickEffect}
                      enableMagnetism={isGameCard ? false : enableMagnetism}
                    >
                      {CardContent}
                    </ParticleCard>
                  </a>
                );
              }

              return (
                <ParticleCard
                  key={index}
                  className={baseClassName}
                  style={cardStyle}
                  disableAnimations={shouldDisableAnimations}
                  particleCount={particleCount}
                  glowColor={glowColor}
                  enableTilt={isGameCard ? false : enableTilt}
                  clickEffect={isGameCard ? false : clickEffect}
                  enableMagnetism={isGameCard ? false : enableMagnetism}
                >
                  {CardContent}
                </ParticleCard>
              );
            }

            const NonStarCardContent = isGameCard ? (
              gameCardContent
            ) : (
              <>
                <div className="card__header flex justify-between items-start gap-2 relative text-white mb-4">
                  <span className="card__label text-base">{card.label}</span>
                  {index === 0 && (
                    <img 
                      src="https://i.postimg.cc/Mp7vnfZn/1000111857.jpg" 
                      alt="Profile" 
                      className="w-14 h-14 rounded-full object-cover border-2 border-purple-500/30 shadow-lg flex-shrink-0"
                    />
                  )}
                  {index === 1 && (
                    <img 
                      src="/img/x.jpg" 
                      alt="X Profile" 
                      className="w-14 h-14 rounded-full object-cover border-2 border-purple-500/30 shadow-lg flex-shrink-0"
                    />
                  )}
                  {index === 4 && (
                    <img 
                      src="/img/insta.jpg" 
                      alt="Instagram Profile" 
                      className="w-14 h-14 rounded-full object-cover border-2 border-purple-500/30 shadow-lg flex-shrink-0"
                    />
                  )}
                  {index === 5 && (
                    <img 
                      src="/img/github.jpg" 
                      alt="GitHub Profile" 
                      className="w-14 h-14 rounded-full object-cover border-2 border-purple-500/30 shadow-lg flex-shrink-0"
                    />
                  )}
                </div>
                <div className="card__content flex flex-col relative text-white mt-auto gap-2">
                  <h3 className={`card__title font-semibold text-xl m-0 ${(index === 0 || index === 1 || index === 5) ? '' : textAutoHide ? 'text-clamp-1' : ''}`}>
                    {card.title}
                  </h3>
                  <p className={`card__description text-xs leading-relaxed opacity-90 ${(index === 0 || index === 1 || index === 5) ? '' : textAutoHide ? 'text-clamp-2' : ''}`}
                     style={(index === 0 || index === 1 || index === 5) ? { display: '-webkit-box', WebkitLineClamp: 6, WebkitBoxOrient: 'vertical', overflow: 'hidden', whiteSpace: 'pre-line' } : {}}>
                    {card.description}
                  </p>
                  {index === 4 && card.showFollowers && followerCount && (
                    <p className="text-sm font-semibold opacity-80 mt-1">
                      {followerCount} followers
                    </p>
                  )}
                </div>
              </>
            );

            if (index === 0 && card.link) {
              return (
                <a
                  key={index}
                  href={card.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block no-underline"
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    className={baseClassName}
                    style={cardStyle}
                    ref={el => {
                      if (!el) return;
                      if (isGameCard) return;

                      const handleMouseMove = e => {
                        if (shouldDisableAnimations) return;

                        const rect = el.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;

                        if (enableTilt) {
                          const rotateX = ((y - centerY) / centerY) * -10;
                          const rotateY = ((x - centerX) / centerX) * 10;

                          gsap.to(el, {
                            rotateX,
                            rotateY,
                            duration: 0.1,
                            ease: 'power2.out',
                            transformPerspective: 1000
                          });
                        }

                        if (enableMagnetism) {
                          const magnetX = (x - centerX) * 0.05;
                          const magnetY = (y - centerY) * 0.05;

                          gsap.to(el, {
                            x: magnetX,
                            y: magnetY,
                            duration: 0.3,
                            ease: 'power2.out'
                          });
                        }
                      };

                      const handleMouseLeave = () => {
                        if (shouldDisableAnimations) return;

                        if (enableTilt) {
                          gsap.to(el, {
                            rotateX: 0,
                            rotateY: 0,
                            duration: 0.3,
                            ease: 'power2.out'
                          });
                        }

                        if (enableMagnetism) {
                          gsap.to(el, {
                            x: 0,
                            y: 0,
                            duration: 0.3,
                            ease: 'power2.out'
                          });
                        }
                      };

                      const handleClick = e => {
                        if (!clickEffect || shouldDisableAnimations) return;

                        const rect = el.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;

                        const maxDistance = Math.max(
                          Math.hypot(x, y),
                          Math.hypot(x - rect.width, y),
                          Math.hypot(x, y - rect.height),
                          Math.hypot(x - rect.width, y - rect.height)
                        );

                        const ripple = document.createElement('div');
                        ripple.style.cssText = `
                          position: absolute;
                          width: ${maxDistance * 2}px;
                          height: ${maxDistance * 2}px;
                          border-radius: 50%;
                          background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
                          left: ${x - maxDistance}px;
                          top: ${y - maxDistance}px;
                          pointer-events: none;
                          z-index: 1000;
                        `;

                        el.appendChild(ripple);

                        gsap.fromTo(
                          ripple,
                          {
                            scale: 0,
                            opacity: 1
                          },
                          {
                            scale: 1,
                            opacity: 0,
                            duration: 0.8,
                            ease: 'power2.out',
                            onComplete: () => ripple.remove()
                          }
                        );
                      };

                      el.addEventListener('mousemove', handleMouseMove);
                      el.addEventListener('mouseleave', handleMouseLeave);
                      el.addEventListener('click', handleClick);
                    }}
                  >
                    {NonStarCardContent}
                  </div>
                </a>
              );
            }

            if (index === 1 && card.link) {
              return (
                <a
                  key={index}
                  href={card.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block no-underline"
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    className={baseClassName}
                    style={cardStyle}
                    ref={el => {
                      if (!el) return;
                      if (isGameCard) return;

                      const handleMouseMove = e => {
                        if (shouldDisableAnimations) return;

                        const rect = el.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;

                        if (enableTilt) {
                          const rotateX = ((y - centerY) / centerY) * -10;
                          const rotateY = ((x - centerX) / centerX) * 10;

                          gsap.to(el, {
                            rotateX,
                            rotateY,
                            duration: 0.1,
                            ease: 'power2.out',
                            transformPerspective: 1000
                          });
                        }

                        if (enableMagnetism) {
                          const magnetX = (x - centerX) * 0.05;
                          const magnetY = (y - centerY) * 0.05;

                          gsap.to(el, {
                            x: magnetX,
                            y: magnetY,
                            duration: 0.3,
                            ease: 'power2.out'
                          });
                        }
                      };

                      const handleMouseLeave = () => {
                        if (shouldDisableAnimations) return;

                        if (enableTilt) {
                          gsap.to(el, {
                            rotateX: 0,
                            rotateY: 0,
                            duration: 0.3,
                            ease: 'power2.out'
                          });
                        }

                        if (enableMagnetism) {
                          gsap.to(el, {
                            x: 0,
                            y: 0,
                            duration: 0.3,
                            ease: 'power2.out'
                          });
                        }
                      };

                      const handleClick = e => {
                        if (!clickEffect || shouldDisableAnimations) return;

                        const rect = el.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;

                        const maxDistance = Math.max(
                          Math.hypot(x, y),
                          Math.hypot(x - rect.width, y),
                          Math.hypot(x, y - rect.height),
                          Math.hypot(x - rect.width, y - rect.height)
                        );

                        const ripple = document.createElement('div');
                        ripple.style.cssText = `
                          position: absolute;
                          width: ${maxDistance * 2}px;
                          height: ${maxDistance * 2}px;
                          border-radius: 50%;
                          background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
                          left: ${x - maxDistance}px;
                          top: ${y - maxDistance}px;
                          pointer-events: none;
                          z-index: 1000;
                        `;

                        el.appendChild(ripple);

                        gsap.fromTo(
                          ripple,
                          {
                            scale: 0,
                            opacity: 1
                          },
                          {
                            scale: 1,
                            opacity: 0,
                            duration: 0.8,
                            ease: 'power2.out',
                            onComplete: () => ripple.remove()
                          }
                        );
                      };

                      el.addEventListener('mousemove', handleMouseMove);
                      el.addEventListener('mouseleave', handleMouseLeave);
                      el.addEventListener('click', handleClick);
                    }}
                  >
                    {NonStarCardContent}
                  </div>
                </a>
              );
            }

            if (index === 4 && card.link) {
              return (
                <a
                  key={index}
                  href={card.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block no-underline"
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    className={baseClassName}
                    style={cardStyle}
                    ref={el => {
                      if (!el) return;
                      if (isGameCard) return;

                      const handleMouseMove = e => {
                        if (shouldDisableAnimations) return;

                        const rect = el.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;

                        if (enableTilt) {
                          const rotateX = ((y - centerY) / centerY) * -10;
                          const rotateY = ((x - centerX) / centerX) * 10;

                          gsap.to(el, {
                            rotateX,
                            rotateY,
                            duration: 0.1,
                            ease: 'power2.out',
                            transformPerspective: 1000
                          });
                        }

                        if (enableMagnetism) {
                          const magnetX = (x - centerX) * 0.05;
                          const magnetY = (y - centerY) * 0.05;

                          gsap.to(el, {
                            x: magnetX,
                            y: magnetY,
                            duration: 0.3,
                            ease: 'power2.out'
                          });
                        }
                      };

                      const handleMouseLeave = () => {
                        if (shouldDisableAnimations) return;

                        if (enableTilt) {
                          gsap.to(el, {
                            rotateX: 0,
                            rotateY: 0,
                            duration: 0.3,
                            ease: 'power2.out'
                          });
                        }

                        if (enableMagnetism) {
                          gsap.to(el, {
                            x: 0,
                            y: 0,
                            duration: 0.3,
                            ease: 'power2.out'
                          });
                        }
                      };

                      const handleClick = e => {
                        if (!clickEffect || shouldDisableAnimations) return;

                        const rect = el.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;

                        const maxDistance = Math.max(
                          Math.hypot(x, y),
                          Math.hypot(x - rect.width, y),
                          Math.hypot(x, y - rect.height),
                          Math.hypot(x - rect.width, y - rect.height)
                        );

                        const ripple = document.createElement('div');
                        ripple.style.cssText = `
                          position: absolute;
                          width: ${maxDistance * 2}px;
                          height: ${maxDistance * 2}px;
                          border-radius: 50%;
                          background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
                          left: ${x - maxDistance}px;
                          top: ${y - maxDistance}px;
                          pointer-events: none;
                          z-index: 1000;
                        `;

                        el.appendChild(ripple);

                        gsap.fromTo(
                          ripple,
                          {
                            scale: 0,
                            opacity: 1
                          },
                          {
                            scale: 1,
                            opacity: 0,
                            duration: 0.8,
                            ease: 'power2.out',
                            onComplete: () => ripple.remove()
                          }
                        );
                      };

                      el.addEventListener('mousemove', handleMouseMove);
                      el.addEventListener('mouseleave', handleMouseLeave);
                      el.addEventListener('click', handleClick);
                    }}
                  >
                    {NonStarCardContent}
                  </div>
                </a>
              );
            }

            if (index === 5 && card.link) {
              return (
                <a
                  key={index}
                  href={card.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block no-underline"
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    className={baseClassName}
                    style={cardStyle}
                    ref={el => {
                      if (!el) return;

                      const handleMouseMove = e => {
                        if (shouldDisableAnimations) return;

                        const rect = el.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;

                        if (enableTilt) {
                          const rotateX = ((y - centerY) / centerY) * -10;
                          const rotateY = ((x - centerX) / centerX) * 10;

                          gsap.to(el, {
                            rotateX,
                            rotateY,
                            duration: 0.1,
                            ease: 'power2.out',
                            transformPerspective: 1000
                          });
                        }

                        if (enableMagnetism) {
                          const magnetX = (x - centerX) * 0.05;
                          const magnetY = (y - centerY) * 0.05;

                          gsap.to(el, {
                            x: magnetX,
                            y: magnetY,
                            duration: 0.3,
                            ease: 'power2.out'
                          });
                        }
                      };

                      const handleMouseLeave = () => {
                        if (shouldDisableAnimations) return;

                        if (enableTilt) {
                          gsap.to(el, {
                            rotateX: 0,
                            rotateY: 0,
                            duration: 0.3,
                            ease: 'power2.out'
                          });
                        }

                        if (enableMagnetism) {
                          gsap.to(el, {
                            x: 0,
                            y: 0,
                            duration: 0.3,
                            ease: 'power2.out'
                          });
                        }
                      };

                      const handleClick = e => {
                        if (!clickEffect || shouldDisableAnimations) return;

                        const rect = el.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;

                        const maxDistance = Math.max(
                          Math.hypot(x, y),
                          Math.hypot(x - rect.width, y),
                          Math.hypot(x, y - rect.height),
                          Math.hypot(x - rect.width, y - rect.height)
                        );

                        const ripple = document.createElement('div');
                        ripple.style.cssText = `
                          position: absolute;
                          width: ${maxDistance * 2}px;
                          height: ${maxDistance * 2}px;
                          border-radius: 50%;
                          background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
                          left: ${x - maxDistance}px;
                          top: ${y - maxDistance}px;
                          pointer-events: none;
                          z-index: 1000;
                        `;

                        el.appendChild(ripple);

                        gsap.fromTo(
                          ripple,
                          {
                            scale: 0,
                            opacity: 1
                          },
                          {
                            scale: 1,
                            opacity: 0,
                            duration: 0.8,
                            ease: 'power2.out',
                            onComplete: () => ripple.remove()
                          }
                        );
                      };

                      el.addEventListener('mousemove', handleMouseMove);
                      el.addEventListener('mouseleave', handleMouseLeave);
                      el.addEventListener('click', handleClick);
                    }}
                  >
                    {NonStarCardContent}
                  </div>
                </a>
              );
            }

            return (
              <div
                key={index}
                className={baseClassName}
                style={cardStyle}
                ref={el => {
                  if (!el) return;
                  if (isGameCard) return;

                  const handleMouseMove = e => {
                    if (shouldDisableAnimations) return;

                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    if (enableTilt) {
                      const rotateX = ((y - centerY) / centerY) * -10;
                      const rotateY = ((x - centerX) / centerX) * 10;

                      gsap.to(el, {
                        rotateX,
                        rotateY,
                        duration: 0.1,
                        ease: 'power2.out',
                        transformPerspective: 1000
                      });
                    }

                    if (enableMagnetism) {
                      const magnetX = (x - centerX) * 0.05;
                      const magnetY = (y - centerY) * 0.05;

                      gsap.to(el, {
                        x: magnetX,
                        y: magnetY,
                        duration: 0.3,
                        ease: 'power2.out'
                      });
                    }
                  };

                  const handleMouseLeave = () => {
                    if (shouldDisableAnimations) return;

                    if (enableTilt) {
                      gsap.to(el, {
                        rotateX: 0,
                        rotateY: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                      });
                    }

                    if (enableMagnetism) {
                      gsap.to(el, {
                        x: 0,
                        y: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                      });
                    }
                  };

                  const handleClick = e => {
                    if (!clickEffect || shouldDisableAnimations) return;

                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const maxDistance = Math.max(
                      Math.hypot(x, y),
                      Math.hypot(x - rect.width, y),
                      Math.hypot(x, y - rect.height),
                      Math.hypot(x - rect.width, y - rect.height)
                    );

                    const ripple = document.createElement('div');
                    ripple.style.cssText = `
                      position: absolute;
                      width: ${maxDistance * 2}px;
                      height: ${maxDistance * 2}px;
                      border-radius: 50%;
                      background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
                      left: ${x - maxDistance}px;
                      top: ${y - maxDistance}px;
                      pointer-events: none;
                      z-index: 1000;
                    `;

                    el.appendChild(ripple);

                    gsap.fromTo(
                      ripple,
                      {
                        scale: 0,
                        opacity: 1
                      },
                      {
                        scale: 1,
                        opacity: 0,
                        duration: 0.8,
                        ease: 'power2.out',
                        onComplete: () => ripple.remove()
                      }
                    );
                  };

                  el.addEventListener('mousemove', handleMouseMove);
                  el.addEventListener('mouseleave', handleMouseLeave);
                  el.addEventListener('click', handleClick);
                }}
              >
                {NonStarCardContent}
              </div>
            );
          })}
        </div>
      </BentoCardGrid>
    </>
  );
};

export default MagicBento;
