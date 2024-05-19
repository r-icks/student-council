import React from "react";
import { RiErrorWarningFill, RiCheckFill } from "react-icons/ri";
import { useAppContext } from "../context/appContext";

const Alert = () => {
  const { showAlert, alertType, alertText } = useAppContext();

  const getBorderColor = () => {
    return alertType === "success" ? "border-green-500" : "border-red-500";
  };

  const getIconColor = () => {
    return alertType === "success" ? "text-green-500" : "text-red-500"; // Icon color based on alert type
  };

  const getIcon = () => {
    return alertType === "success" ? (
      <RiCheckFill className={getIconColor()} />
    ) : (
      <RiErrorWarningFill className={getIconColor()} />
    );
  };

  return (
    <div
      className={`${
        showAlert ? "block" : "hidden"
      } fixed bottom-4 right-4 p-4 rounded-lg shadow-lg bg-dark ${getBorderColor()} ml-4 border-l-4 z-50`} // Adjust background color
    >
      <div className="flex items-center">
        <div className="text-2xl mr-4">{getIcon()}</div>
        <div className="text-white">{alertText}</div> {/* Adjust text color */}
      </div>
    </div>
  );
};

export default Alert;
