import React from "react";
import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail, FiDownload } from "react-icons/fi";
import { Typewriter } from "react-simple-typewriter";
import { scrollToSection } from "../../utils/scrollUtils";
import ParticleBackground from "../ParticleBackground/ParticleBackground";
import "./Landing.css";

const Landing = () => {
  // Handle resume download
  const handleResumeDownload = () => {
    const link = document.createElement('a');
    link.href = '/src/assets/Resume.pdf';
    link.download = 'Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle contact scroll
  const handleContactClick = () => {
    scrollToSection('contact');
  };
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 1.2,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  const socialVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 1.5,
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
        delay: 0.5,
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Particle background */}
      <ParticleBackground />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-24 h-24 bg-green-500/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left side - Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <motion.div variants={itemVariants}>
              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="text-white">Hi, I'm </span>
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Jay Gupta
                </span>
              </motion.h1>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-6 text-gray-300"
            >
              <span>I'm a </span>
              <span className="text-blue-400">
                <Typewriter
                  words={[
                    "Full Stack Developer",
                    "React Developer",
                    "UI/UX Designer",
                    "Problem Solver",
                  ]}
                  loop={true}
                  cursor
                  cursorStyle="|"
                  typeSpeed={100}
                  deleteSpeed={50}
                  delaySpeed={1000}
                />
              </span>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Passionate about creating beautiful, functional, and user-friendly
              web applications. I love turning ideas into reality through code
              and design.
            </motion.p>

            {/* Action buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
              variants={itemVariants}
            >
              <motion.button
                className="glow-button bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleResumeDownload}
              >
                <FiDownload className="group-hover:rotate-12 transition-transform duration-300" />
                Download Resume
              </motion.button>
              <motion.button
                className="glow-button border-2 border-blue-500 text-blue-400 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleContactClick}
              >
                <FiMail />
                Get In Touch
              </motion.button>
            </motion.div>

            {/* Social links */}
            <motion.div
              className="flex gap-6 justify-center lg:justify-start"
              variants={socialVariants}
            >
              {[
                { icon: FiGithub, href: "#", label: "GitHub" },
                { icon: FiLinkedin, href: "#", label: "LinkedIn" },
                { icon: FiMail, href: "#", label: "Email" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors duration-300 p-3 rounded-full hover:bg-white/10"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 + index * 0.1 }}
                >
                  <social.icon size={24} />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Right side - Profile image */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-2">
            <motion.div
              className="relative"
              variants={imageVariants}
              animate="animate"
            >
              <motion.div
                className="relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[450px] lg:h-[450px]"
                variants={floatingVariants}
                animate="animate"
              >
                {/* Glowing background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
                
                {/* Profile image container */}
                <div className="landing-gradient-border">
                  <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl">
                    <img
                      src="/src/assets/Profile.jpg"
                      alt="Jay Gupta"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 via-transparent to-purple-500/10" />
                  </div>
                </div>

                {/* Floating elements around image */}
                <motion.div
                  className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full"
                  animate={{
                    y: [-5, 5, -5],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500 rounded-full"
                  animate={{
                    y: [5, -5, 5],
                    rotate: [360, 180, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute top-1/2 -left-6 w-4 h-4 bg-pink-500 rounded-full"
                  animate={{
                    x: [-3, 3, -3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-3 bg-gray-400 rounded-full mt-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
        <p className="text-gray-400 text-sm mt-2">Scroll down</p>
      </motion.div>
    </section>
  );
};

export default Landing;
