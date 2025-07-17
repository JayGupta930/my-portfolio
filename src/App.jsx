import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar/Navbar";
import SplashScreen from "./components/SplashScreen/SplashScreen";
import About from "./components/About/About";
import Skills from "./components/Skills/Skills";
import Experience from "./components/Experience/Experience";
import Education from "./components/Education/Education";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import Project from "./components/Projects/Projects";
import BlurBlob from "./BlurBlob";
import "./mobile-responsive.css";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <div className="bg-[#050414] min-h-screen w-full">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" onComplete={handleSplashComplete} />
        ) : (
          <>
            <BlurBlob position={{top: '35%', left: '20%' }} size={{ width: '30%', height: '40%'}}></BlurBlob>

            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
              
            <div className="relative pt-16 sm:pt-20 overflow-x-hidden w-full max-w-full">
                <Navbar />
                <About />
                <Skills />
                <Experience />
                <Project />
                <Education />
                <Contact />
                <Footer />
              </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;