import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./SplashScreen.css";
import ProfileImage from "../../assets/Profile.jpg";

const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simple progress animation
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 800);
          return 100;
        }
        return prev + 3;
      });
    }, 80); // About 3 seconds total

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-[#050414] z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      {/* Profile image */}
      <motion.div
        className="mb-8"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-1 shadow-2xl">
          <div className="w-full h-full rounded-full overflow-hidden">
            <img
              src={ProfileImage}
              alt="Jay Gupta"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </motion.div>

      {/* Name */}
      <motion.h1
        className="text-4xl font-bold text-white mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        Jay Gupta
      </motion.h1>

      {/* Title */}
      <motion.p
        className="text-xl text-gray-400 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        MERN Stack Developer
      </motion.p>

      {/* Loading bar */}
      <motion.div
        className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Loading text */}
      <motion.p
        className="text-gray-500 mt-4 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        {progress < 33 ? "Loading..." : 
         progress < 66 ? "Preparing..." : 
         progress < 100 ? "Almost ready..." : "Welcome!"}
      </motion.p>
    </motion.div>
  );
};

export default SplashScreen;
