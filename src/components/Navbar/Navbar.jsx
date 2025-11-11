import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Detect scroll and change navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const menuItems = [
    { path: "/", label: "About", end: true },
    { path: "/skills", label: "Skills" },
    { path: "/projects", label: "Projects" },
    { path: "/education", label: "Education" },
    { path: "/creativity", label: "Creativity" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition duration-300 px-4 sm:px-[7vw] md:px-[7vw] lg:px-[20vw] ${
        isScrolled ? "bg-[#050414] bg-opacity-50 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="text-white py-4 sm:py-5 flex justify-between items-center">
        {/* Logo */}
        <div className="text-base sm:text-lg font-semibold cursor-pointer">
          <span className="text-[#8245ec]">&lt;</span>
          <span className="text-white">Jay</span>
          <span className="text-[#8245ec]">/</span>
          <span className="text-white">Gupta</span>
          <span className="text-[#8245ec]">&gt;</span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-gray-300">
          {menuItems.map((item) => (
            <li
              key={item.path}
            >
              <NavLink
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `cursor-pointer transition-colors duration-200 hover:text-[#8245ec] ${
                    isActive ? "text-[#8245ec]" : ""
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Social Icons */}
        <div className="hidden md:flex space-x-4">
          <a
            href="https://github.com/JayGupta930"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-[#8245ec]"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/jaygupta930"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-[#8245ec]"
          >
            <FaLinkedin size={24} />
          </a>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          {isOpen ? (
            <FiX
              className="text-3xl text-[#8245ec] cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          ) : (
            <FiMenu
              className="text-3xl text-[#8245ec] cursor-pointer"
              onClick={() => setIsOpen(true)}
            />
          )}
        </div>
      </div>

      {/* Mobile Menu Items */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mx-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 sm:w-4/5 sm:mx-0 bg-[#050414] bg-opacity-95 backdrop-filter backdrop-blur-lg z-50 rounded-lg shadow-lg md:hidden mt-2">
          <ul className="flex flex-col items-center space-y-4 py-6 text-gray-300">
            {menuItems.map((item) => (
              <li
                key={item.path}
              >
                <NavLink
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `cursor-pointer hover:text-white text-base sm:text-lg ${
                      isActive ? "text-[#8245ec]" : ""
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <div className="flex space-x-6 mt-4">
              <a
                href="https://github.com/JayGupta930"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://www.linkedin.com/in/jaygupta930"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;