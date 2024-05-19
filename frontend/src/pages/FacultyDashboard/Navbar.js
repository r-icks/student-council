import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUserGroup } from "react-icons/fa6";
import logo from "../../assets/MITLogo.jpg";
import { useAppContext } from "../../context/appContext";

const NavLinks = [
  {
    text: "Status",
    link: "",
  },
];

const Navbar = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);

  const { logoutUser, user } = useAppContext();

  const handleLinkClick = (path) => {
    setActiveLink(`/fa${path}`);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/fa">
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
                to={`/fa${navLink.link}`}
                className={`text-dark ${
                  activeLink === `/fa${navLink.link}`
                    ? "hover:text-dark"
                    : "hover:text-primary"
                } px-3 py-2 text-sm font-medium ${
                  activeLink === `/fa${navLink.link}`
                    ? "border-b-2 border-primary"
                    : ""
                }`}
                onClick={() => handleLinkClick(navLink.link)}
              >
                {navLink.text}
              </Link>
            ))}
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center text-white focus:outline-none hover:bg-primary bg-secondary py-1 px-2 rounded-lg"
              >
                <FaUserGroup className="h-6 w-6 mr-2" />{" "}
                <span className="hidden sm:inline">{user.name}</span>
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 bg-white rounded-md shadow-md">
                  <button
                    className="block px-4 py-2 text-dark hover:bg-grey hover:text-white"
                    onClick={logoutUser}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="bg-white shadow-md">
            <div className="space-y-2 px-4 pb-3 pt-2">
              {NavLinks.map((navLink) => (
                <div className="block mb-2" key={navLink.link}>
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
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center text-dark hover:text-primary focus:outline-none focus:text-primary"
                >
                  <FaUserGroup className="h-6 w-6  mr-2" />
                  <span>{user.name}</span>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 bg-white rounded-md shadow-md">
                    <button
                      className="block px-4 py-2 text-dark hover:bg-grey hover:text-white"
                      onClick={logoutUser}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
