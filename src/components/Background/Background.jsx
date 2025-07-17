import React, { useMemo } from 'react';

const ParallaxStars = ({ className = '' }) => {
  // Use useMemo to prevent regeneration on every render
  const starData = useMemo(() => {
    const generateStars = (count) => {
      return Array.from({ length: count }, () => ({
        x: Math.floor(Math.random() * 2000),
        y: Math.floor(Math.random() * 2000)
      }));
    };

    const smallStars = generateStars(400);
    const mediumStars = generateStars(100);
    const bigStars = generateStars(40);

    // Create box-shadow string for stars
    const createBoxShadow = (stars) => {
      return stars.map(star => `${star.x}px ${star.y}px #FFF`).join(', ');
    };

    return {
      smallStarShadows: createBoxShadow(smallStars),
      mediumStarShadows: createBoxShadow(mediumStars),
      bigStarShadows: createBoxShadow(bigStars)
    };
  }, []); // Empty dependency array ensures this only runs once

  return (
    <div className={`h-screen overflow-hidden bg-[#050414] relative ${className}`}>
      {/* Small Stars */}
      <div
        className="absolute w-px h-px bg-transparent"
        style={{
          boxShadow: starData.smallStarShadows,
          animation: 'animStar 50s linear infinite'
        }}
      >
        <div
          className="absolute w-px h-px bg-transparent"
          style={{
            content: ' ',
            top: '2000px',
            boxShadow: starData.smallStarShadows
          }}
        />
      </div>

      {/* Medium Stars */}
      <div
        className="absolute w-0.5 h-0.5 bg-transparent"
        style={{
          boxShadow: starData.mediumStarShadows,
          animation: 'animStar 100s linear infinite'
        }}
      >
        <div
          className="absolute w-0.5 h-0.5 bg-transparent"
          style={{
            content: ' ',
            top: '2000px',
            boxShadow: starData.mediumStarShadows
          }}
        />
      </div>

      {/* Big Stars */}
      <div
        className="absolute w-1 h-1 bg-transparent"
        style={{
          boxShadow: starData.bigStarShadows,
          animation: 'animStar 150s linear infinite'
        }}
      >
        <div
          className="absolute w-1 h-1 bg-transparent"
          style={{
            content: ' ',
            top: '2000px',
            boxShadow: starData.bigStarShadows
          }}
        />
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes animStar {
          from {
            transform: translateY(0px);
          }
          to {
            transform: translateY(-2000px);
          }
        }
      `}</style>
    </div>
  );
};

export default ParallaxStars;