import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import About from "./components/About/About";
import GithubContribution from "./components/GithubContribution/GithubContribution";
import ShuffleHero from "./components/SuffleHero/SuffleHero";
import Skills from "./components/Skills/Skills";
import Experience from "./components/Experience/Experience";
import Education from "./components/Education/Education";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import Project from "./components/Projects/Projects";
import Creativity from "./components/Creativity/Creativity";
import Music from "./Creativity/Music/Music";
import BlurBlob from "./BlurBlob";
import ScribbleLayout from "./pages/ScribbleLayout";
import HomePage from "./pages/HomePage";
import GameRoomPage from "./pages/GameRoomPage";
import ResultsPage from "./pages/ResultsPage";
import AboutPage from "./pages/AboutPage";
import "./mobile-responsive.css";
import { scrollToSection } from "./utils/scrollUtils";
import MagicBento from "./components/MagicBento";
import ModelViewer from "./components/ModelViewer";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
} from "react-icons/si";

import LogoLoop from "./components/LogoLoop";
// import ImageTrail from "./components/Imagetrail";
import { DemoOne } from "./components/Demo";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

const LandingPage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollToId) {
      const targetId = location.state.scrollToId;
      const timeoutId = setTimeout(() => {
        scrollToSection(targetId);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [location.state]);

  const techLogos = [
    { node: <SiReact />, title: "React", href: "https://react.dev" },
    { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
    {
      node: <SiTypescript />,
      title: "TypeScript",
      href: "https://www.typescriptlang.org",
    },
    {
      node: <SiTailwindcss />,
      title: "Tailwind CSS",
      href: "https://tailwindcss.com",
    },
  ];

  return (
    <>
      <About />
      <GithubContribution />
      <ShuffleHero />
      <div
        style={{ height: "200px", position: "relative", overflow: "hidden" }}
      >
        {/* Basic horizontal loop */}
        <LogoLoop
          logos={techLogos}
          speed={120}
          direction="left"
          logoHeight={48}
          gap={40}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          // fadeOutColor=""
          ariaLabel="Technology partners"
        />

        {/* Vertical loop with deceleration on hover */}
        {/* <LogoLoop
        logos={techLogos}
        speed={80}
        direction="up"
        logoHeight={48}
        gap={40}
        hoverSpeed={20}
        fadeOut
      /> */}
      </div>

      {/* <div
        style={{ height: "500px", position: "relative", overflow: "hidden" }}
      >
        <ImageTrail
          items={[
            // <img src = "./assets/suffle_logo/characteri.webp"/>,
            // <img src = "./assets/suffle_logo/characterii.webp"/>

            "https://unsplash.com/photos/person-wearing-a-beanie-and-patterned-shirt-h91Q88TP4Uc",
            "https://unsplash.com/photos/two-carabiners-connecting-orange-and-black-rope-GZgsM-7MGgU",
            "https://unsplash.com/photos/a-couple-holds-hands-looking-at-each-other-BQOtgvtLNgY",
            "https://unsplash.com/photos/two-hands-clinking-champagne-glasses-by-the-sea-n7UIY9pYE3I"
          ]}
          variant={1}
        />
      </div> */}

      <MagicBento
        textAutoHide={true}
        enableStars={true}
        enableSpotlight={true}
        enableBorderGlow={true}
        enableTilt={true}
        enableMagnetism={true}
        clickEffect={true}
        spotlightRadius={300}
        particleCount={12}
        glowColor="132, 0, 255"
      />

      <div className="w-full max-w-7xl mx-auto h-[600px] flex items-center justify-between gap-12 px-8 md:px-16 lg:px-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl my-8 border border-gray-800">
        <div className="flex-1 text-left pl-8">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white" style={{ textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>
            Fast as lightning.
          </h2>
        </div>
        <div className="flex-1 pr-8">
          <ModelViewer
            url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/ToyCar/glTF-Binary/ToyCar.glb"
            width="100%"
            height={600}
          />
        </div>
      </div>
    </>
  );
};

const SkillsPage = () => (
  <>
    <Skills />
    <Experience />
  </>
);

const ProjectsPage = () => <Project />;

const EducationPage = () => (
  <>
    <Education />
  </>
);

const App = () => {
  return (
    <div className="bg-[#050414] min-h-screen w-full">
      <BlurBlob
        position={{ top: "35%", left: "20%" }}
        size={{ width: "30%", height: "40%" }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <div className="relative pt-16 sm:pt-20 overflow-x-hidden w-full max-w-full">
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/creativity" element={<Creativity />} />
          <Route path="/creativity/music" element={<Music />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/scribble" element={<ScribbleLayout />}>
            <Route index element={<HomePage />} />
            <Route path="room/:roomId" element={<GameRoomPage />} />
            <Route path="results" element={<ResultsPage />} />
          </Route>
          <Route path="*" element={<LandingPage />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
};

export default App;
