import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const SharedLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex-grow flex items-center justify-center pt-24 pb-6 px-4 h-screen w-screen overflow-hidden">
        <div className="bg-white rounded-md overflow-hidden shadow-md px-4 mx-4 h-full w-full overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SharedLayout;
