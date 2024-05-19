import React, { useState, useEffect } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { useAppContext } from "../../context/appContext";

const ClubProfile = () => {
  const { user, updateProfile, loading } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [logo, setLogo] = useState(null);
  const [fullName, setFullName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  useEffect(() => {
    if (user) {
      setLogo(
        user.logo
          ? `https://sc-club-2.s3.ap-south-1.amazonaws.com/${
              user.logo
            }?timestamp=${Date.now()}`
          : null
      );
      setFullName(user.fullName || "");
      setTagline(user.tagLine || "");
      setDescription(user.description || "");
      setVideo(
        user.video
          ? `https://sc-club-2.s3.ap-south-1.amazonaws.com/${
              user.video
            }?timestamp=${Date.now()}`
          : null
      );
    }
  }, [user]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newLogo = URL.createObjectURL(file);
      setLogo(newLogo);
      setLogoFile(file);
      console.log("Uploaded logo:", file);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newVideo = URL.createObjectURL(file);
      setVideo(newVideo);
      setVideoFile(file);
      console.log("Uploaded video:", file);
    }
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleLogoClick = () => {
    if (isEditing) {
      document.getElementById("logoInput").click();
    }
  };

  const handleVideoClick = () => {
    if (isEditing) {
      document.getElementById("videoInput").click();
    }
  };

  const handleSave = async () => {
    const newClub = new FormData();

    if (
      logo &&
      !logo.startsWith("https://sc-club-2.s3.ap-south-1.amazonaws.com")
    ) {
      newClub.append("logo", logoFile);
    }
    if (
      video &&
      !video.startsWith("https://sc-club-2.s3.ap-south-1.amazonaws.com")
    ) {
      newClub.append("video", videoFile);
    }
    if (fullName !== user.fullName) {
      newClub.append("fullName", fullName);
    }
    if (description !== user.description) {
      newClub.append("description", description);
    }
    if (tagline !== user.tagLine) {
      newClub.append("tagLine", tagline);
    }

    await updateProfile(newClub);
    setIsEditing(false);
  };

  const avatar = (
    <div
      className={`w-32 h-32 mb-4 relative overflow-hidden rounded-full cursor-pointer ${
        isEditing ? "border border-primary shadow-md" : "shadow-md"
      }`}
      onClick={handleLogoClick}
      disabled={loading}
    >
      {logo ? (
        <img
          src={logo}
          alt={`Logo of ${user.name}`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white bg-gray-400 text-7xl">
          {user.name.charAt(0)}
        </div>
      )}
      {isEditing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-50 transition duration-300">
          <AiOutlineEdit className="text-white text-2xl" />
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto mt-8 p-8 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-semibold">Club Profile</h1>
        <button
          disabled={loading}
          onClick={isEditing ? handleSave : handleEditToggle}
          className={`px-4 py-2 ${
            isEditing
              ? "bg-primary hover:bg-secondary"
              : "bg-secondary hover:bg-primary"
          } text-white rounded-full focus:outline-none transition duration-300`}
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <label className="block mb-2 text-gray-700">Club Logo</label>
          {avatar}
          {isEditing && (
            <input
              id="logoInput"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
          )}
        </div>

        <div>
          <label className="block mb-2 text-gray-700">Club Name</label>
          <p className="text-lg font-semibold mb-4">{user.name}</p>
        </div>

        <div>
          <label className="block mb-2 text-gray-700">Club Email Address</label>
          <p className="text-lg mb-4">{user.email}</p>
        </div>

        <div>
          <label className="block mb-2 text-gray-700">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700">Club Tagline</label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary"
          />
          {isEditing && (
            <p className="text-xs text-gray-500 mt-1">
              Tagline to display on the card on the Landing Page
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-gray-700">Club Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary"
          ></textarea>
        </div>

        <div>
          <label className="block mb-2 text-gray-700">Club Video</label>
          {video && (
            <div className="mb-4">
              <video key={video} controls className="w-full h-60">
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          {isEditing && (
            <div className="mb-4">
              <button
                disabled={loading}
                className="bg-primary text-white px-4 py-2 rounded-full focus:outline-none"
                onClick={handleVideoClick}
              >
                Upload New Video
              </button>
              <input
                id="videoInput"
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
                disabled={loading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubProfile;
