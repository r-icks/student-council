import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/MITLogo.jpg";

const NavLinks = [
  {
    text: "Home",
    link: "/",
  },
  {
    text: "Student Clubs",
    link: "/student-clubs",
  },
  // {
  //   text: "Our Team",
  //   link: "/our-team",
  // },
  // {
  //   text: "Event Calendar",
  //   link: "/event-calendar",
  // },
];

const Navbar = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (path) => {
    setActiveLink(path);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-20">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/">
              <img className="h-12 w-auto" src={logo} alt="Your Company" />
            </Link>
          </div>
          <div className="sm:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-primary hover:text-secondary focus:outline-none focus:text-primary"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
          <div className="hidden sm:flex items-center space-x-4 ml-auto">
            {NavLinks.map((navLink) => (
              <Link
                to={navLink.link}
                className={`text-dark ${
                  activeLink === navLink.link
                    ? "hover:text-dark"
                    : "hover:text-primary"
                } px-3 py-2 text-sm font-medium ${
                  activeLink === navLink.link ? "border-b-2 border-primary" : ""
                }`}
                onClick={() => handleLinkClick(navLink.link)}
              >
                {navLink.text}
              </Link>
            ))}
          </div>
          <div className="hidden sm:block ml-8">
            <Link
              to="/login"
              className="bg-secondary text-white hover:bg-secondaryLight rounded-md px-2 py-2 text-sm font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="bg-white shadow-md">
            <div className="space-y-2 px-4 pb-3 pt-2">
              {NavLinks.map((navLink) => (
                <div className="block mb-2">
                  <Link
                    to={navLink.link}
                    className={`text-dark px-1 py-1 text-base font-medium ${
                      activeLink === navLink.link
                        ? "border-b-2 border-primary"
                        : ""
                    }`}
                    onClick={() => handleLinkClick(navLink.link)}
                  >
                    {navLink.text}
                  </Link>
                </div>
              ))}
              <div className="block mb-2">
                <Link
                  to="/login"
                  className={`text-dark px-1 py-2 text-base font-medium ${
                    activeLink === "/our-team"
                      ? "border-b-2 border-primary"
                      : ""
                  }`}
                  onClick={() => handleLinkClick("/login")}
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
