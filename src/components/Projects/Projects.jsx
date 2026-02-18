import React, { useState } from "react";
import { projects } from "../../constants";
import MorphingCard from '../ui/morphing-card-stack'

const Work = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const handleOpenModal = (project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  // Transform projects data for the MorphingCard component
  const projectCards = projects.map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description,
    image: project.image,
    tags: project.tags,
    github: project.github,
    webapp: project.webapp,
  }));

  return (
    <section
      id="work"
      className="relative py-10 sm:py-14 md:py-16 lg:py-24 px-4 sm:px-8 font-sans mb-16 sm:mb-24 lg:mb-32"
    >
      {/* Section Title */}
      <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16 max-w-5xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">PROJECTS</h2>
        <div className="w-16 sm:w-20 md:w-24 lg:w-32 h-0.5 sm:h-1 bg-purple-500 mx-auto mt-3 sm:mt-4"></div>
        <p className="text-gray-400 mt-3 sm:mt-4 text-xs sm:text-sm md:text-base lg:text-lg font-semibold max-w-3xl mx-auto leading-relaxed">
          A showcase of the projects I have worked on, highlighting my skills
          and experience in various technologies
        </p>
      </div>
      
      {/* Morphing Card Stack for Projects */}
      <MorphingCard 
        cards={projectCards} 
        defaultLayout="stack"
        className="w-full max-w-5xl mx-auto mt-8 sm:mt-10 lg:mt-12"
        onCardClick={(card) => handleOpenModal(projects.find(p => p.id === card.id))}
      />

      {/* Modal Container with Beautiful Animations */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 animate-fadeIn overflow-y-auto"
          onClick={handleCloseModal}
          style={{
            background: 'radial-gradient(ellipse at center, rgba(88, 28, 135, 0.15) 0%, rgba(0, 0, 0, 0.95) 70%)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Floating particles background effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
          
          <div 
            className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-[95vw] sm:max-w-2xl lg:max-w-4xl my-4 sm:my-0 overflow-hidden border border-purple-500/20 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow: '0 0 60px rgba(147, 51, 234, 0.3), 0 0 100px rgba(147, 51, 234, 0.1)',
            }}
          >
            {/* Glowing top border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 z-20 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gray-800/90 text-gray-400 hover:text-white hover:bg-purple-600 transition-all duration-300 hover:rotate-90 hover:scale-110 backdrop-blur-sm border border-gray-700/50"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col md:flex-row h-auto max-h-[85vh] sm:max-h-[90vh]">
              {/* Image Section with gorgeous presentation */}
              <div className="relative md:w-1/2 bg-gradient-to-b from-gray-800/50 to-gray-900 p-2 sm:p-3 md:p-4 flex items-center justify-center">
                <div className="relative group w-full">
                  {/* Glow effect behind image */}
                  <div className="absolute inset-4 bg-purple-500/20 blur-2xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="relative w-full h-auto max-h-[25vh] sm:max-h-[30vh] md:max-h-[70vh] object-contain rounded-lg sm:rounded-xl shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500"
                    style={{
                      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(147, 51, 234, 0.2)',
                    }}
                  />
                  
                  {/* Decorative corners */}
                  <div className="absolute top-1 sm:top-2 left-1 sm:left-2 w-3 h-3 sm:w-4 sm:h-4 border-l-2 border-t-2 border-purple-500/50 rounded-tl"></div>
                  <div className="absolute top-1 sm:top-2 right-1 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 border-r-2 border-t-2 border-purple-500/50 rounded-tr"></div>
                  <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 w-3 h-3 sm:w-4 sm:h-4 border-l-2 border-b-2 border-purple-500/50 rounded-bl"></div>
                  <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 border-r-2 border-b-2 border-purple-500/50 rounded-br"></div>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="md:w-1/2 p-3 sm:p-4 md:p-6 pt-4 sm:pt-6 md:pt-4 flex flex-col justify-center space-y-2 sm:space-y-3 md:space-y-4">
                {/* Title with gradient */}
                <h3 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent pr-6 sm:pr-8">
                  {selectedProject.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-400 text-[11px] sm:text-xs md:text-sm lg:text-base leading-relaxed line-clamp-3 sm:line-clamp-4 md:line-clamp-6">
                  {selectedProject.description}
                </p>
                
                {/* Tags with hover effects */}
                <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2">
                  {selectedProject.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-purple-500/10 text-[9px] sm:text-[10px] md:text-xs font-medium text-purple-400 rounded-full px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 border border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/20 transition-all duration-300 cursor-default"
                      style={{animationDelay: `${index * 50}ms`}}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Action Buttons with gorgeous styling */}
                <div className="flex gap-2 sm:gap-3 md:gap-4 pt-1.5 sm:pt-2 md:pt-3">
                  {selectedProject.tags.length === 1 && selectedProject.tags[0] === "Figma" ? (
                    <a
                      href={selectedProject.github || selectedProject.webapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full relative group bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-center flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform">
                        <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.02s-1.354-3.02-3.019-3.02h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.015-4.49-4.491S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.02s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.02s1.354 3.02 3.019 3.02h3.117v-6.04H8.148zm7.704 0c2.476 0 4.49 2.015 4.49 4.49s-2.014 4.49-4.49 4.49-4.49-2.015-4.49-4.49 2.014-4.49 4.49-4.49zm0 1.471c-1.665 0-3.019 1.355-3.019 3.02s1.354 3.02 3.019 3.02 3.019-1.355 3.019-3.02-1.354-3.02-3.019-3.02zM8.148 24c-2.476 0-4.49-2.015-4.49-4.49s2.014-4.49 4.49-4.49 4.49 2.015 4.49 4.49-2.014 4.49-4.49 4.49zm0-7.509c-1.665 0-3.019 1.355-3.019 3.02s1.354 3.02 3.019 3.02 3.019-1.355 3.019-3.02-1.354-3.02-3.019-3.02z"/>
                      </svg>
                      View in Figma
                    </a>
                  ) : (
                    <>
                      <a
                        href={selectedProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-1/2 group relative bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-center flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 transition-all duration-300 border border-gray-700 hover:border-purple-500/50 hover:-translate-y-0.5"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span>Code</span>
                      </a>
                      <a
                        href={selectedProject.webapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-1/2 group relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-center flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:scale-110 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span>Live Demo</span>
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Work;