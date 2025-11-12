import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { scrollToSection } from "../../utils/scrollUtils";
import shuffleImg01 from "../../assets/suffle_logo/characteri.webp";
import shuffleImg02 from "../../assets/suffle_logo/characterii.webp";
import shuffleImg03 from "../../assets/suffle_logo/characteriii.webp";
import shuffleImg04 from "../../assets/suffle_logo/characteriv.webp";
import shuffleImg05 from "../../assets/suffle_logo/characterv.webp";
import shuffleImg06 from "../../assets/suffle_logo/charactervi.webp";
import shuffleImg07 from "../../assets/suffle_logo/charactervii.webp";
import shuffleImg08 from "../../assets/suffle_logo/characterviii.webp";
import shuffleImg09 from "../../assets/suffle_logo/characterix.webp";
import shuffleImg10 from "../../assets/suffle_logo/characteri.webp";
import shuffleImg11 from "../../assets/suffle_logo/characterii.webp";
import shuffleImg12 from "../../assets/suffle_logo/characteriii.webp";
import shuffleImg13 from "../../assets/suffle_logo/characteriv.webp";
import shuffleImg14 from "../../assets/suffle_logo/characterv.webp";
import shuffleImg15 from "../../assets/suffle_logo/charactervi.webp";
import shuffleImg16 from "../../assets/suffle_logo/charactervii.webp";

const ShuffleHero = () => {
  return (
    <section id="hero" className="w-full min-h-screen px-8 py-12 grid grid-cols-1 md:grid-cols-2 items-center gap-8">
      <div>
        <span className="block mb-4 text-xs md:text-sm text-indigo-500 font-medium">
          Better every day
        </span>
        <h3 className="text-4xl md:text-6xl font-semibold text-white">
          Let's change it up a bit
        </h3>
        <p className="text-base md:text-lg text-slate-700 text-white my-4 md:my-6">
          Passionate about building scalable web applications with modern technologies.
          Specializing in React, JavaScript, and full-stack development to create
          innovative solutions that make a difference.
        </p>
        <button
          onClick={() => scrollToSection("contact")}
          className="bg-indigo-500 text-white font-medium py-2 px-4 rounded transition-all hover:bg-indigo-600 active:scale-95 cursor-pointer"
        >
          Let's talk
        </button>
      </div>
      <ShuffleGrid />
    </section>
  );
};

const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const squareData = [
  { id: 1, src: shuffleImg01 },
  { id: 2, src: shuffleImg02 },
  { id: 3, src: shuffleImg03 },
  { id: 4, src: shuffleImg04 },
  { id: 5, src: shuffleImg05 },
  { id: 6, src: shuffleImg06 },
  { id: 7, src: shuffleImg07 },
  { id: 8, src: shuffleImg08 },
  { id: 9, src: shuffleImg09 },
  { id: 10, src: shuffleImg10 },
  { id: 11, src: shuffleImg11 },
  { id: 12, src: shuffleImg12 },
  { id: 13, src: shuffleImg13 },
  { id: 14, src: shuffleImg14 },
  { id: 15, src: shuffleImg15 },
  { id: 16, src: shuffleImg16 },
];

const generateSquares = () => {
  return shuffle([...squareData]).map((sq) => (
    <motion.div
      key={sq.id}
      layout
      transition={{ duration: 1.5, type: "spring" }}
      className="w-full h-full"
    >
      <img
        className="w-full h-full object-cover"
        src={sq.src}
        alt={`shuffle gallery item ${sq.id}`}
        loading="lazy"
        decoding="async"
        width="256"
        height="256"
      />
    </motion.div>
  ));
};

const ShuffleGrid = () => {
  const timeoutRef = useRef(null);
  const [squares, setSquares] = useState(generateSquares());

  useEffect(() => {
    shuffleSquares();

    return () => clearTimeout(timeoutRef.current);
  }, []);

  const shuffleSquares = () => {
    setSquares(generateSquares());

    timeoutRef.current = setTimeout(shuffleSquares, 3000);
  };

  return (
    <div className="grid grid-cols-4 grid-rows-4 h-[450px] gap-1">
      {squares.map((sq) => sq)}
    </div>
  );
};

export default ShuffleHero;