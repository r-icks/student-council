import React from "react";
import { ClubCard, Loading } from "../../components";
import { useAppContext } from "../../context/appContext";

// const clubsData = [
//   {
//     _id: 1,
//     name: "We at ACM Manipal bring innovation that is unimagined by anyone",
//     logo: "ACM-logo-url",
//     tagline: "Tagline for ACM",
//   },
//   {
//     _id: 2,
//     name: "Technical Club 2",
//     logo: "TechClub2-logo-url",
//     tagline: "Tagline for Technical Club 2",
//   },
//   {
//     _id: 3,
//     name: "Non Technical Club 1",
//     logo: "NonTechClub1-logo-url",
//     tagline: "Tagline for Non Technical Club 1",
//   },
//   {
//     _id: 4,
//     name: "Non Technical Club 2",
//     logo: "NonTechClub2-logo-url",
//     tagline: "Tagline for Non Technical Club 2",
//   },
// ];

const StudentClubs = () => {
  const { clubsLoading, clubsData } = useAppContext();
  if (clubsLoading) return <Loading />;
  const redirectToClubProfile = (clubId) => {
    // Redirect to /club-profile/_id in a new tab
    window.open(`/club-profile/${clubId}`, "_blank");
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {clubsData?.map((club) => (
          <div
            key={club._id}
            onClick={() => redirectToClubProfile(club._id)}
            style={{ cursor: "pointer" }} // Add cursor pointer for better UX
          >
            <ClubCard
              name={club.name}
              tagline={club.tagline}
              logo={`https://sc-club-2.s3.ap-south-1.amazonaws.com/${club.logo}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentClubs;
