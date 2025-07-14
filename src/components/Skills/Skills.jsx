// src/components/Skills/Skills.jsx
import React from "react";
import { SkillsInfo } from "../../constants";
import Tilt from "react-parallax-tilt";

const Skills = () => (
  <section
    id="skills"
    className="py-12 sm:py-16 md:py-24 pb-12 sm:pb-16 md:pb-24 px-4 sm:px-[7vw] md:px-[7vw] lg:px-[20vw] font-sans bg-skills-gradient clip-path-custom"
  >
    {/* Section Title */}
    <div className="text-center mb-8 sm:mb-12 md:mb-16">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">SKILLS</h2>
      <div className="w-16 sm:w-20 md:w-24 h-1 bg-[#8245ec] mx-auto mt-2"></div>
      <p className="text-gray-400 mt-4 text-sm sm:text-base md:text-lg font-semibold px-4 sm:px-0">
      A collection of my technical skills and expertise honed through various projects and experiences
      </p>
    </div>

    {/* Skill Categories */}
    <div className="flex flex-col lg:flex-row lg:flex-wrap gap-4 sm:gap-6 lg:gap-5 py-6 sm:py-8 md:py-10 lg:justify-between">
      {SkillsInfo.map((category) => (
        <div
          key={category.title}
          className="bg-gray-900 backdrop-blur-md px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 mb-6 sm:mb-8 md:mb-10 w-full lg:w-[48%] rounded-2xl border border-white 
          shadow-[0_0_20px_1px_rgba(130,69,236,0.3)]"
        >
          <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-400 mb-4 sm:mb-6 text-center">
            {category.title}
          </h3>

          {/* Skill Items - Responsive grid */}
          <Tilt
            key={category.title}
            tiltMaxAngleX={20}
            tiltMaxAngleY={20}
            perspective={1000}
            scale={1.05}
            transitionSpeed={1000}
            gyroscope={true}
          >
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 w-full">
              {category.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 bg-transparent border-2 border-gray-700 rounded-2xl sm:rounded-3xl py-2 sm:py-2 px-1 sm:px-2 text-center"
                >
                  <img
                    src={skill.logo}
                    alt={`${skill.name} logo`}
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 flex-shrink-0"
                  />
                  <span className="text-xs sm:text-xs md:text-sm text-gray-300 break-words">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </Tilt>
        </div>
      ))}
    </div>
  </section>
);

export default Skills;