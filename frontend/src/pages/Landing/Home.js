import React from "react";
import { FaLinkedin } from "react-icons/fa6";
import logo from "../../assets/SCLogo.png";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      {/* Upper Division */}
      <div className="hidden md:flex items-center justify-between w-full md:w-2/3">
        <div className="text-left md:text-center">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-dark to-primary text-transparent bg-clip-text">
              STUDENT COUNCIL 2023-24
            </span>
          </h1>
          <hr className="border-secondary mb-4" />
          <p className="text-gray-700 mb-3 text-right">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
            odio. Praesent libero. Sed cursus ante dapibus diam.
          </p>
          <p className="text-gray-700 text-left">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
            odio. Praesent libero. Sed cursus ante dapibus diam.
          </p>
        </div>
        <div className="ml-16 md:w-1/2">
          <img src={logo} alt="Logo" className="w-full h-auto" />
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex flex-col items-center w-full">
        <div className="w-full mb-4 px-20 pt-3">
          <img src={logo} alt="Logo" className="w-full h-auto" />
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-dark to-primary text-transparent bg-clip-text">
              Student Council 2023-24
            </span>
          </h1>
          <hr className="border-secondary mb-4" />
          <p className="text-gray-700 mb-3 text-right">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
            odio. Praesent libero. Sed cursus ante dapibus diam.
          </p>
          <p className="text-gray-700 text-left">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
            odio. Praesent libero. Sed cursus ante dapibus diam.
          </p>
        </div>
      </div>

      {/* Lower Division */}
      <div className="mt-8 md:mt-40 text-center">
        <h3 className="text-md font-bold text-dark">Developed By</h3>
        <div className="flex items-center justify-center mt-1 mb-1">
          <p className="text-grey-500">Rishabh Jain</p>
          <a
            href="https://www.linkedin.com/in/your-linkedin-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-secondary hover:text-primary ml-1 text-lg"
          >
            <FaLinkedin />
          </a>
        </div>
        <p className="text-gray-500 text-sm">
          Technical Secretary, Student Council 2023-24
        </p>
      </div>
    </div>
  );
};

export default Home;
