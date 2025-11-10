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
import BlurBlob from "./BlurBlob";
import "./mobile-responsive.css";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

const AboutPage = () => (
  <>
    <About />
    <GithubContribution />
    <ShuffleHero />
  </>
);

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
      <BlurBlob position={{ top: "35%", left: "20%" }} size={{ width: "30%", height: "40%" }} />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <div className="relative pt-16 sm:pt-20 overflow-x-hidden w-full max-w-full">
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<AboutPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<AboutPage />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
};

export default App;