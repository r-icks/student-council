import React from "react";

const ClubCard = ({ name, tagline, logo, rank }) => {
  const getBorderColor = () => {
    switch (rank) {
      case "gold":
        return "border-gold bg-gradient-to-r from-gold to-dark";
      case "silver":
        return "border-silver bg-gradient-to-r from-silver to-dark";
      case "bronze":
        return "border-bronze bg-gradient-to-r from-bronze to-dark";
      default:
        return "border-white bg-white";
    }
  };

  const getTextColor = () => {
    switch (rank) {
      case "gold":
        return "text-white";
      case "silver":
        return "text-white";
      case "bronze":
        return "text-white";
      default:
        return "text-gray-600";
    }
  };

  const avatar = logo ? (
    <div className="w-full h-full p-1">
      <img
        src={logo}
        alt={`Logo of ${name}`}
        className="w-full h-full object-contain"
      />
    </div>
  ) : (
    <div
      className={`w-full h-full flex items-center justify-center text-white bg-gray-400 text-7xl`}
    >
      {name.charAt(0)}
    </div>
  );

  return (
    <div
      className={`w-full h-48 shadow-md max-w-md mx-auto overflow-hidden rounded-lg ${getBorderColor()} border-l-8 transition-transform transform hover:scale-105`}
    >
      <div className="flex h-full">
        <div className="w-1/2 p-4 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2 line-clamp-2">{name}</h2>
            <p className={`${getTextColor()} font-semibold line-clamp-4`}>
              {tagline}
            </p>
          </div>
        </div>
        <div className="w-1/2 relative p-2">
          <div className="w-full h-full overflow-hidden rounded-lg bg-white">
            {avatar}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubCard;
