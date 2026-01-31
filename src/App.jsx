import { useEffect, useRef, Suspense, lazy, memo, useMemo } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from "react-icons/si";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import BlurBlob from "./BlurBlob";
import "./mobile-responsive.css";
import { scrollToSection } from "./utils/scrollUtils";
import SmoothScroll from "./components/SmoothScroll/SmoothScroll";

// Eagerly loaded components (critical for first paint)
import About from "./components/About/About";
import HeroSection from "./components/mainhero";

// Lazy loaded below-the-fold components for better initial load
const Skills = lazy(() => import("./components/Skills/Skills"));
const Experience = lazy(() => import("./components/Experience/Experience"));
const Education = lazy(() => import("./components/Education/Education"));
const GithubContribution = lazy(() => import("./components/GithubContribution/GithubContribution"));
const LogoLoop = lazy(() => import("./components/LogoLoop"));
const MagicBento = lazy(() => import("./components/MagicBento"));

// Lazy loaded pages and components (loaded on-demand)
const Contact = lazy(() => import("./components/Contact/Contact"));
const Project = lazy(() => import("./components/Projects/Projects"));
const Creativity = lazy(() => import("./components/Creativity/Creativity"));
const Music = lazy(() => import("./Creativity/Music/Music"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const GamesPage = lazy(() => import("./pages/GamesPage"));

// Loading fallback - memoized to prevent re-renders
const PageLoader = memo(() => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
  </div>
));

// Smaller loader for inline sections
const SectionLoader = memo(() => (
  <div className="flex items-center justify-center py-12">
    <div className="w-8 h-8 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
  </div>
));

const ScrollToTop = memo(() => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
});

const LandingPage = () => {
  const sectionRef = useRef(null)
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

  // Memoize techLogos to prevent recreation on each render
  const techLogos = useMemo(() => {
    return [
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
  }, []);

  // Optimized scroll parallax effect using requestAnimationFrame
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scroll = window.scrollY;
          const shift = Math.min(scroll * 0.15, 80);
          section.style.transform = `translateY(${shift}px)`;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <HeroSection />
      <About sectionRef={sectionRef} />
      <hr className="border-t-2 border-gray-600 mx-auto max-w-7xl my-8" />
      <Suspense fallback={<SectionLoader />}>
        <Skills />
      </Suspense>
      <hr className="border-t-2 border-gray-600 mx-auto max-w-7xl my-8" />
      <Suspense fallback={<SectionLoader />}>
        <Experience />
      </Suspense>
      <hr className="border-t-2 border-gray-600 mx-auto max-w-7xl my-8" />
      <Suspense fallback={<SectionLoader />}>
        <Education />
      </Suspense>
      <hr className="border-t-2 border-gray-600 mx-auto max-w-7xl my-8" />
      <Suspense fallback={<SectionLoader />}>
        <GithubContribution />
      </Suspense>
      <hr className="border-t-2 border-gray-600 mx-auto max-w-7xl my-8" />
      <Suspense fallback={<SectionLoader />}>
        <div className="flex items-center"
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
            ariaLabel="Technology partners"
          />
        </div>
      </Suspense>

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

      <hr className="border-t-2 border-gray-600 mx-auto max-w-7xl my-8" />
      <Suspense fallback={<SectionLoader />}>
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
      </Suspense>
    </>
  );
};

const SkillsPage = () => (
  <>
    <Skills />
    <Experience />
  </>
);

const ProjectsPage = () => (
  <Suspense fallback={<PageLoader />}>
    <Project />
  </Suspense>
);

const EducationPage = () => (
  <>
    <Education />
  </>
);

const App = () => {
  return (
    <SmoothScroll>
      <div className="bg-[#050414] min-h-screen w-full">
        <BlurBlob
          position={{ top: "35%", left: "20%" }}
          size={{ width: "30%", height: "40%" }}
        />

        <div className="relative overflow-x-hidden w-full max-w-full">
          <Navbar />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<Suspense fallback={<PageLoader />}><AboutPage /></Suspense>} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/education" element={<EducationPage />} />
            <Route path="/creativity" element={<Suspense fallback={<PageLoader />}><Creativity /></Suspense>} />
            <Route path="/creativity/music" element={<Suspense fallback={<PageLoader />}><Music /></Suspense>} />
            <Route path="/games" element={<Suspense fallback={<PageLoader />}><GamesPage /></Suspense>} />
            <Route path="/contact" element={<Suspense fallback={<PageLoader />}><Contact /></Suspense>} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </SmoothScroll>
  );
};

export default App;
