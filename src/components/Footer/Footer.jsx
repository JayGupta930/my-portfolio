import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube, FaGithub } from "react-icons/fa";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="text-white py-6 sm:py-8 px-4 sm:px-[7vw] md:px-[7vw] lg:px-[20vw]">
      <div className="container mx-auto text-center">
        {/* Name / Logo */}
        <h2 className="text-lg sm:text-xl font-semibold text-purple-500">Jay Gupta </h2>

        {/* Navigation Links - Responsive */}
        <nav className="flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-6 mt-4">
          {[
            { name: "About", path: "/" },
            { name: "Skills", path: "/skills" },
            { name: "Projects", path: "/projects" },
            { name: "Education", path: "/education" },
          ].map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="hover:text-purple-500 text-xs sm:text-sm md:text-base my-1 px-2 py-1 rounded transition-colors cursor-pointer"
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* Social Media Icons - Responsive */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6">
          {[
            { icon: <FaLinkedin />, link: "https://www.linkedin.com/in/jaygupta930" },
            { icon: <FaGithub />, link: "https://github.com/JayGupta930" },
            
          ].map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg sm:text-xl hover:text-purple-500 transition-transform transform hover:scale-110 p-2"
            >
              {item.icon}
            </a>
          ))}
        </div>

        {/* Copyright Text */}
        <p className="text-sm text-gray-400 mt-6">
          © 2025 Jay Gupta. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;