import { memo } from 'react'
import { Typewriter } from 'react-simple-typewriter'
import resumePDF from '../../assets/Resume.pdf'

const About = ({ sectionRef }) => {
  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-4 px-4 font-sans min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-80px)]
                transition-transform duration-300 ease-in-out will-change-transform"
    >
      {/* Top Left Side - Name & Role */}
      <div
        className="absolute top-16 left-8 sm:top-20 sm:left-16 max-w-xs text-left pointer-events-none"
      >
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-white text-opacity-70">
          About Me
        </p>
        <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-white leading-tight">
          Hi, I'm Jay Gupta
        </h2>
        <div className="mt-3 text-sm sm:text-base text-white text-opacity-80 leading-6 flex flex-wrap items-center gap-1">
          <span>I am a</span>
          <span className="text-[#8245ec] font-semibold">
            <Typewriter
              words={['MERN Stack Developer', 'UI/UX Designer', 'Coder']}
              loop={0}
              cursor
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={2000}
            />
          </span>
        </div>
      </div>

      {/* Bottom Right Side - Description & Buttons */}
      <div
        className="absolute bottom-16 right-8 sm:bottom-20 sm:right-16 max-w-sm text-right"
      >
        <p className="text-xs font-semibold tracking-[0.35em] uppercase text-white text-opacity-70">
          My Journey
        </p>
        <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-white leading-tight">
          Building scalable web experiences
        </h2>
        <p className="mt-3 text-sm sm:text-base text-white text-opacity-80 leading-6">
          I am a MERN-Stack developer with over 2 years of experience in building scalable web applications. 
          I specialize in creating seamless user experiences and efficient solutions.
        </p>
        <div className="mt-6 inline-flex justify-end gap-4 pointer-events-auto flex-wrap">
          <a
            target="_blank"
            download
            href={resumePDF}
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 py-2 text-sm font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:bg-white hover:text-black hover:border-white"
          >
            Download Resume
            <span aria-hidden="true" className="text-lg leading-none">↓</span>
          </a>
          <a
            target="_blank"
            href={resumePDF}
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 py-2 text-sm font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:bg-white hover:text-black hover:border-white"
          >
            View Resume
            <span aria-hidden="true" className="text-lg leading-none">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default memo(About)
