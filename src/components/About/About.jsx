import { Typewriter } from 'react-simple-typewriter'
import Tilt from 'react-parallax-tilt'
import profileImage from '../../assets/profile.jpg'
import resumePDF from '../../assets/Resume.pdf'

const About = () => {
  return (
    <section
      id="about"
      className="py-4 px-4 sm:px-[7vw] md:px-[7vw] lg:px-[20vw] font-sans mt-10 md:mt-24 lg:mt-4"
    >
      <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 sm:gap-6 md:gap-16 lg:gap-28">
        
        {/* Left Side */}
        <div className="w-full md:w-1/2 text-center md:text-left mt-4 sm:mt-6 md:mt-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight">
            Hi, I am
          </h1>
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Jay Gupta
          </h2>

          {/* Typing Effect */}
          <div className="mb-4 sm:mb-6 min-h-[60px] sm:min-h-[50px] flex items-center justify-center md:justify-start w-auto">
            <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-xl font-semibold text-[#8245ec] flex flex-col sm:flex-row items-center justify-center md:justify-start text-center md:text-left">
              <span className="text-white mb-2 sm:mb-0 sm:mr-2 text-nowrap">I am a</span>
              <span
                className="text-[#8245ec] inline-block overflow-hidden min-w-[200px] sm:min-w-[250px]"
                style={{
                  // textAlign: 'center'
                }}
              >
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
            </h3>
          </div>

          {/* About Me Paragraph */}
          <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-6 sm:mb-8 md:mb-12 mt-4 sm:mt-6 md:mt-8 leading-relaxed text-center md:text-left">
            I am a Mern-Stack developer with over 2 years of experience in
            building scalable web applications. Skilled in both front-end and
            back-end development, I specialize in the MERN stack and other
            modern technologies to create seamless user experiences and
            efficient solutions.
          </p>

          {/* Resume Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center md:justify-start items-center">
            <a
              target="_blank"
              download
              href={resumePDF}
              rel="noopener noreferrer"
              className="flex items-center justify-center text-white py-4 px-8 sm:px-10 lg:px-12 rounded-full cursor-pointer text-base sm:text-lg lg:text-xl font-bold transition duration-300 transform hover:scale-105 whitespace-nowrap w-[200px] sm:w-[220px] lg:w-[240px] h-[50px] sm:h-[55px] lg:h-[60px]"
              style={{
                background: 'linear-gradient(90deg, #8245ec, #a855f7)',
                boxShadow: '0 0 2px #8245ec, 0 0 2px #8245ec, 0 0 40px #8245ec',
              }}
            >
              DOWNLOAD RESUME
            </a>
            <a
              target="_blank"
              href={resumePDF}
              rel="noopener noreferrer"
              className="flex items-center justify-center text-white py-4 px-8 sm:px-10 lg:px-12 rounded-full cursor-pointer text-base sm:text-lg lg:text-xl font-bold transition duration-300 transform hover:scale-105 whitespace-nowrap w-[200px] sm:w-[220px] lg:w-[240px] h-[50px] sm:h-[55px] lg:h-[60px]"
              style={{
                background: 'linear-gradient(90deg, #8245ec, #a855f7)',
                boxShadow: '0 0 2px #8245ec, 0 0 2px #8245ec, 0 0 40px #8245ec',
              }}
            >
              VIEW RESUME
            </a>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end mb-4 sm:mb-6 md:mb-0">
          <Tilt
            className="w-36 h-36 xs:w-40 xs:h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-[30rem] xl:h-[30rem] border-4 border-purple-700 rounded-full"
            tiltMaxAngleX={20}
            tiltMaxAngleY={20}
            perspective={1000}
            scale={1.05}
            transitionSpeed={1000}
            gyroscope={true}
          >
            <img
              src={profileImage}
              alt="Jay Gupta"
              className="w-full h-full rounded-full object-cover drop-shadow-[0_10px_20px_rgba(130,69,236,0.5)]"
            />
          </Tilt>
        </div>

      </div>
    </section>
  )
}

export default About
