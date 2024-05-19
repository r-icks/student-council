import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import { Loading } from "../components";

const ClubProfile = () => {
  const { getClubProfile } = useAppContext();

  const { clubId } = useParams();

  const [loading, setLoading] = useState(true);

  const [clubProfile, setClubProfile] = useState(null);

  const [fetchInitiated, setFetchInitiated] = useState(false);

  useEffect(() => {
    if (!fetchInitiated) {
      setFetchInitiated(true);
      const fetchData = async () => {
        try {
          const data = await getClubProfile(clubId);
          setClubProfile(data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching room request data:", error);
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [getClubProfile, clubId, fetchInitiated]);

  if (loading) {
    return <Loading />;
  }

  const avatar = (
    <div
      className={`w-32 h-32 mb-4 relative overflow-hidden rounded-full cursor-pointer shadow-md`}
      disabled={true}
    >
      {clubProfile?.logo ? (
        <img
          src={`https://sc-club-2.s3.ap-south-1.amazonaws.com/${
            clubProfile?.logo
          }?timestamp=${Date.now()}`}
          alt={`Logo of ${clubProfile.name}`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white bg-gray-400 text-7xl">
          {clubProfile?.name?.charAt(0)}
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto mt-8 p-8 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-semibold">Club Profile</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <label className="block mb-2 text-gray-700">Club Logo</label>
          {avatar}
        </div>

        <div>
          <label className="block mb-2 text-gray-700">Club Name</label>
          <p className="text-lg font-semibold mb-4">{clubProfile?.name}</p>
        </div>

        <div>
          <label className="block mb-2 text-gray-700">Club Email Address</label>
          <p className="text-lg mb-4">{clubProfile?.email}</p>
        </div>

        <div>
          <label className="block mb-2 text-gray-700">Full Name</label>
          <input
            type="text"
            value={clubProfile?.fullName}
            disabled={true}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700">Club Tagline</label>
          <input
            type="text"
            value={clubProfile?.tagline}
            disabled={true}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700">Club Description</label>
          <textarea
            value={clubProfile?.description}
            disabled={true}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary"
          ></textarea>
        </div>

        <div>
          {clubProfile?.video && (
            <label className="block mb-2 text-gray-700">Club Video</label>
          )}
          {clubProfile?.video && (
            <div className="mb-4">
              <video
                key={`https://sc-club-2.s3.ap-south-1.amazonaws.com/${
                  clubProfile?.video
                }?timestamp=${Date.now()}`}
                controls
                className="w-full h-60"
              >
                <source
                  src={`https://sc-club-2.s3.ap-south-1.amazonaws.com/${
                    clubProfile?.video
                  }?timestamp=${Date.now()}`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubProfile;
