import React from "react";
import { useState, useEffect } from "react";
import { FaCheck, FaClock, FaTimes } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import { Loading } from "../components";

const RoomAllocationForm = () => {
  const { findRequestData, user, userRole, updateRoomRequest } =
    useAppContext();

  const { reqid } = useParams();
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(true);

  const [roomRequestData, setRoomRequestData] = useState(null);

  const [fetchInitiated, setFetchInitiated] = useState(false);

  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (!fetchInitiated) {
      setFetchInitiated(true);
      const fetchData = async () => {
        try {
          const data = await findRequestData(reqid);
          setRoomRequestData(data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching room request data:", error);
          setLoading(false);
        }
      };

      fetchData();
    }
    // No dependencies here to ensure this effect runs only once
  }, [findRequestData, reqid, fetchInitiated]);

  const handleApproval = async (approved) => {
    const data = {
      approved,
      remarks,
      requestId: reqid,
    };

    updateRoomRequest(data);
  };

  if (loading) {
    return <Loading />;
  }

  const functionDescriptionUrl = `https://sc-club-2.s3.ap-south-1.amazonaws.com/${roomRequestData?.functionDescription}`;

  const logo = `https://sc-club-2.s3.ap-south-1.amazonaws.com/${roomRequestData?.clubLogo}`;

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg">
      <div className="grid sm:grid-cols-2 gap-6 col-span-2">
        <h1 className="text-3xl font-semibold mb-6 col-span-2 sm:col-span-1">
          {roomRequestData?.clubName}
        </h1>
        {roomRequestData?.clubLogo && (
          <div
            className={`w-32 h-32 mb-4 relative overflow-hidden rounded-full cursor-pointer  ml-auto`}
          >
            <img
              src={logo}
              alt={`Logo of ${roomRequestData?.clubName}`}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block mb-2 text-gray-700">Function Type</label>
          <input
            disabled={true}
            type="text"
            value={roomRequestData?.functionType}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary"
          />
        </div>
        <div className="col-span-2 grid sm:grid-cols-2 gap-x-6 gap-y-2">
          <label className="col-span-2 block mb-2 text-gray-700">
            Point of Contact Details
          </label>
          <div className="col-span-1 sm:col-span-1">
            <input
              type="text"
              placeholder="Name"
              value={roomRequestData?.pointOfContact?.name}
              disabled={true}
              className="w-full mb-2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <input
              disabled={true}
              type="text"
              placeholder="Registration Number"
              value={roomRequestData?.pointOfContact?.registrationNumber}
              className="w-full mb-2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <input
              disabled={true}
              type="text"
              placeholder="Contact Number"
              value={roomRequestData?.pointOfContact?.contactNumber}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary"
            />
          </div>
        </div>
        <div className="col-span-2">
          <label className="block mb-2 text-gray-700">Purpose</label>
          <input
            disabled={true}
            type="text"
            value={roomRequestData?.purpose}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary"
          />
        </div>
        <div className="col-span-2 ">
          <label className="block mb-2 text-gray-700">Date</label>
          <input
            disabled={true}
            type="text"
            //transfer date to dd-mm-yyyy format here
            value={new Date(roomRequestData?.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-secondary appearance-none"
          />
        </div>
        <div className="col-span-2">
          {roomRequestData?.equipmentRequired?.length > 0 && (
            <label className="block mb-2 text-gray-700">
              Equipment Required
            </label>
          )}
          <div className="flex flex-wrap">
            {roomRequestData?.equipmentRequired?.map((equipment) => {
              return (
                <div className="flex items-center mr-4 mb-2">
                  <input
                    type="checkbox"
                    id="projector"
                    checked={true}
                    disabled={true}
                    className="mr-2"
                  />
                  <label htmlFor="projector">{equipment}</label>
                </div>
              );
            })}
          </div>
        </div>
        <div className="col-span-2 grid sm:grid-cols-2 gap-x-6 gap-y-2">
          <label className="col-span-2 block mb-2 text-gray-700">
            Place Required
          </label>
          <input
            disabled={true}
            type="text"
            placeholder="Building"
            value={roomRequestData?.placeRequired?.building}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary"
          />
          <input
            disabled={true}
            type="text"
            placeholder="Room Number"
            value={roomRequestData?.placeRequired?.roomNumber}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary"
          />
        </div>
        {roomRequestData?.functionDescription && (
          <div className="col-span-2">
            <div
              className={`border border-gray-300 rounded-md p-4 cursor-pointer transition-colors ${
                hovered ? "bg-gray-50" : "bg-white"
              }`}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={() => window.open(functionDescriptionUrl, "_blank")}
            >
              <p className="text-gray-700">
                View Function Description Document
              </p>
            </div>
          </div>
        )}
        <div className="col-span-2">
          <h2 className="text-xl font-semibold mb-4">Approvals</h2>
          <div className="flex flex-col space-y-4">
            {/* Faculty Advisor */}
            <div className="flex items-center">
              <p className="text-gray-700 mr-2">Faculty Advisor:</p>
              {roomRequestData?.approvals?.facultyAdvisor?.approved === true ? (
                <FaCheck className="h-5 w-5 text-green-500 mr-1" />
              ) : roomRequestData?.approvals?.facultyAdvisor?.approved ===
                false ? (
                <FaTimes className="h-5 w-5 text-red-500 mr-1" />
              ) : (
                <FaClock className="h-5 w-5 text-yellow-500 mr-1" />
              )}
              <p className="text-gray-700">
                {roomRequestData?.approvals?.facultyAdvisor?.remarks}
              </p>
            </div>
            {/* Swo */}
            <div className="flex items-center">
              <p className="text-gray-700 mr-2">Student Welfare:</p>
              {roomRequestData?.approvals?.swo?.approved === true ? (
                <FaCheck className="h-5 w-5 text-green-500 mr-1" />
              ) : roomRequestData?.approvals?.swo?.approved === false ? (
                <FaTimes className="h-5 w-5 text-red-500 mr-1" />
              ) : (
                <FaClock className="h-5 w-5 text-yellow-500 mr-1" />
              )}
              <p className="text-gray-700">
                {roomRequestData?.approvals?.swo?.remarks}
              </p>
            </div>
            {/* Security */}
            <div className="flex items-center">
              <p className="text-gray-700 mr-2">Security:</p>
              {roomRequestData?.approvals?.security?.approved === true ? (
                <FaCheck className="h-5 w-5 text-green-500 mr-1" />
              ) : roomRequestData?.approvals?.security?.approved === false ? (
                <FaTimes className="h-5 w-5 text-red-500 mr-1" />
              ) : (
                <FaClock className="h-5 w-5 text-yellow-500 mr-1" />
              )}
              <p className="text-gray-700">
                {roomRequestData?.approvals?.security?.remarks}
              </p>
            </div>
          </div>
        </div>
        {(((userRole === "admin" || userRole === "swo") &&
          roomRequestData?.approvals?.facultyAdvisor?.approved &&
          roomRequestData?.approvals?.swo?.approved !== true &&
          roomRequestData?.approvals?.swo?.approved !== false) ||
          (userRole === "security" &&
            roomRequestData?.approvals?.swo?.approved &&
            roomRequestData?.approvals?.security?.approved !== true &&
            roomRequestData?.approvals?.security?.approved !== false) ||
          (userRole === "fa" &&
            roomRequestData?.faemail === user.email &&
            roomRequestData?.approvals?.facultyAdvisor?.approved !== true &&
            roomRequestData?.approvals?.facultyAdvisor?.approved !==
              false)) && (
          <>
            <hr className="col-span-2 my-8 border-gray-300" />

            <div className="col-span-2">
              <h2 className="text-xl font-semibold mb-4">Approve / Deny</h2>
              <form className="flex flex-col space-y-4">
                <input
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-primary"
                  type="text"
                  placeholder="Remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleApproval(true)}
                    className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
                  >
                    <FaCheck className="mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(false)}
                    className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
                  >
                    <FaTimes className="mr-2" />
                    Deny
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RoomAllocationForm;
