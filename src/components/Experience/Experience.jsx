import React from "react";
import { experiences } from "../../constants"; // Import the experiences data

const Experience = () => {
  // Debug: Log the experiences data
  console.log("Experiences data:", experiences);
  console.log("Number of experiences:", experiences.length);
  
  return (
    <section
      id="experience"
      className="py-12 sm:py-16 md:py-24 pb-12 sm:pb-16 md:pb-24 px-4 sm:px-[7vw] md:px-[7vw] lg:px-[16vw] font-sans bg-skills-gradient clip-path-custom-3"
    >
      {/* Section Title */}
      <div className="text-center mb-8 sm:mb-12 md:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">EXPERIENCE</h2>
        <div className="w-20 sm:w-24 md:w-32 h-1 bg-purple-500 mx-auto mt-4"></div>
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
            <div className="hidden sm:block absolute left-[50%] transform -translate-x-1/2 bg-gray-400 border-4 border-[#8245ec] w-12 h-12 sm:w-16 sm:h-16 rounded-full flex justify-center items-center z-10">
              {exp.img ? (
                <img
                  src={exp.img}
                  alt={exp.company}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs sm:text-sm">
                    {exp.company ? exp.company.substring(0, 2).toUpperCase() : exp.role.substring(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div
              className={`w-full sm:max-w-md p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl border border-white bg-gray-900 backdrop-blur-md shadow-[0_0_20px_1px_rgba(130,69,236,0.3)] ${
                index % 2 === 0 ? "sm:mr-8" : "sm:ml-8"
              } sm:ml-8 transform transition-transform duration-300 hover:scale-105`}
            >
              {/* Flex container for logo and text */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6">
                {/* Company Logo/Image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center p-2 shadow-lg">
                  {exp.img ? (
                    <img
                      src={exp.img}
                      alt={exp.company}
                      className="w-full h-full object-contain rounded-md"
                    />
                  ) : (
                    <div className="w-full h-full bg-purple-600 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {exp.company ? exp.company.substring(0, 2).toUpperCase() : exp.role.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Role, Company Name, and Date */}
                <div className="flex flex-col justify-between text-center sm:text-left">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white">
                      {exp.role}
                    </h3>
                    {exp.company && (
                      <h4 className="text-sm sm:text-base text-gray-300">
                        {exp.company}
                      </h4>
                    )}
                  </div>
                  {/* Date at the bottom */}
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">{exp.date}</p>
                </div>
              </div>

              {/* Description */}
              <p className="mt-4 text-gray-400 text-sm sm:text-base">{exp.desc}</p>
              
              {/* Skills */}
              {exp.skills && exp.skills.length > 0 && (
                <div className="mt-4">
                  <p className="text-gray-300 font-semibold text-sm mb-2">Technologies Used:</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full"
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