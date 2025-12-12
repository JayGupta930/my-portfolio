import React from "react";
import { experiences } from "../../constants"; // Import the experiences data

const Experience = () => {
  return (
    <section
      id="experience"
      className="py-12 sm:py-16 md:py-24 pb-12 sm:pb-16 md:pb-24 px-4 sm:px-[7vw] md:px-[7vw] lg:px-[16vw] font-sans bg-skills-gradient clip-path-custom-3"
    >
      {/* Section Title */}
      <div className="text-center mb-8 sm:mb-12 md:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">EXPERIENCE</h2>
        <div className="w-20 sm:w-24 md:w-32 h-1 bg-gradient-to-r from-purple-500 via-violet-500 to-cyan-400 mx-auto mt-4"></div>
        <p className="text-gray-400 mt-4 text-sm sm:text-base md:text-lg font-semibold px-4 sm:px-0">
          My professional journey showcasing hands-on experience in web development
        </p>
      </div>

      {/* Experience Timeline */}
      <div className="relative">
        {/* Vertical line - hidden on mobile */}
        <div className="hidden sm:block absolute left-[50%] transform -translate-x-1/2 w-1 bg-white h-full"></div>

        {/* Experience Entries */}
        {experiences.map((exp, index) => (
          <div
            key={exp.id}
            className={`flex flex-col items-center mb-8 sm:mb-16 relative w-full ${
              index % 2 === 0 ? "sm:pr-[50%]" : "sm:pl-[50%]"
            }`}
          >
            {/* Timeline Circle - adjusted for mobile */}
            <div 
              className="hidden sm:block absolute left-[50%] transform -translate-x-1/2 bg-gray-400 border-4 border-transparent w-12 h-12 sm:w-16 sm:h-16 rounded-full flex justify-center items-center z-10"
              style={{
                background: 'linear-gradient(#9ca3af, #9ca3af) padding-box, linear-gradient(to right, #a855f7, #8b5cf6, #22d3ee) border-box',
              }}
            >
              <img
                src={exp.img}
                alt={exp.company}
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            {/* Content Section */}
            <div
              className={`w-full sm:max-w-md p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl border border-transparent bg-gray-900 backdrop-blur-md shadow-[0_0_20px_1px_rgba(130,69,236,0.3)] ${
                index % 2 === 0 ? "sm:mr-8" : "sm:ml-8"
              } sm:ml-8 transform transition-transform duration-300 hover:scale-105`}
              style={{
                background: 'linear-gradient(#111827, #111827) padding-box, linear-gradient(to right, #a855f7, #8b5cf6, #22d3ee) border-box',
              }}
            >
              {/* Flex container for image and text */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6">
                {/* Company Logo/Image */}
                <div className="w-20 h-16 sm:w-24 sm:h-16 bg-white rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                  <img
                    src={exp.img}
                    alt={exp.company}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Role, Company Name, and Date */}
                <div className="flex flex-col justify-between text-center sm:text-left">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white">
                      {exp.role}
                    </h3>
                    <h4 className="text-sm sm:text-base text-gray-300">
                      {exp.company}
                    </h4>
                  </div>
                  {/* Date at the bottom */}
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">{exp.date}</p>
                </div>
              </div>

              <p className="mt-4 text-gray-400 text-sm sm:text-base">{exp.desc}</p>
              
              {/* Skills */}
              {exp.skills && exp.skills.length > 0 && (
                <div className="mt-4">
                  <p className="text-gray-300 font-bold text-sm mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-purple-600/30 border border-purple-500 text-purple-300 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;