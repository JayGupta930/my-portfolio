import React, { useState, useEffect, memo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { scrollToSection } from "../../utils/scrollUtils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const menuItems = [
    { path: "/", label: "Home", end: true, scrollToTop: true },
    { path: "/projects", label: "Projects" },
    { path: "/games", label: "Games" },
    { path: "/creativity", label: "Creativity" },
    { path: "/contact", label: "Contact" },
    { path: "/about", label: "About", end: true },
  ];

  const handleMenuItemClick = (event, item) => {
    if (item.scrollToTop && location.pathname === item.path) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsOpen(false);
      return;
    }

    if (item.scrollToId && location.pathname === item.path) {
      event.preventDefault();
      scrollToSection(item.scrollToId);
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 transition duration-300 px-4 sm:px-[7vw] md:px-[7vw] lg:px-[20vw] backdrop-filter backdrop-blur-lg">
      <div className="text-white py-4 sm:py-5 flex justify-between items-center ">
        {/* Logo */}
        <div className="text-base sm:text-lg font-semibold cursor-pointer">
          <span className="text-[#ffffff]">&lt;</span>
          <span className="text-[#ffffff]">Jay</span>
          <span className="text-[#ffffff]">/</span>
          <span className="text-[#ffffff]">Gupta</span>
          <span className="text-[#ffffff]">&gt;</span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-white ">
          {menuItems.map((item) => (
            <li
              key={item.path}
              className="group"
            >
              <NavLink
                to={item.path}
                end={item.end}
                state={item.scrollToId ? { scrollToId: item.scrollToId } : undefined}
                onClick={(event) => handleMenuItemClick(event, item)}
                className={({ isActive }) =>
                  `cursor-pointer transition-colors duration-200 relative overflow-hidden inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 ${
                    isActive ? "after:w-full" : "after:w-0 hover:after:w-full"
                  }`
                }
              >
                <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
                  {item.label}
                </span>
                <span className="absolute left-0 top-0 inline-block transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                  {item.label}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Social Icons */}
        <div className="hidden md:flex space-x-4 ">
          <a
            href="https://github.com/JayGupta930"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#8245ec]"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/jaygupta930"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#8245ec]"
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
        <div className="fixed top-16 left-0 right-0 mx-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 sm:w-4/5 sm:mx-0 bg-[#050414] border border-white/10 backdrop-filter backdrop-blur-lg z-[100] rounded-lg shadow-lg md:hidden">
          <ul className="flex flex-col items-center space-y-4 py-6 text-white">
            {menuItems.map((item) => (
              <li
                key={item.path}
              >
                <NavLink
                  to={item.path}
                  end={item.end}
                  state={item.scrollToId ? { scrollToId: item.scrollToId } : undefined}
                  onClick={(event) => handleMenuItemClick(event, item)}
                  className={({ isActive }) =>
                    `cursor-pointer hover:text-[#8245ec] text-base sm:text-lg ${
                      isActive ? "text-[#8245ec]" : "text-white"
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
                className="text-white hover:text-[#8245ec]"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://www.linkedin.com/in/jaygupta930"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#8245ec]"
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

export default memo(Navbar);