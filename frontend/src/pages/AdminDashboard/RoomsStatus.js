import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/appContext";
import { Loading } from "../../components";
import {
  BsFillQuestionCircleFill,
  BsXCircleFill,
  BsCheckCircleFill,
} from "react-icons/bs";

const RoomRequestsTable = () => {
  const { getRequestsData } = useAppContext();

  const [roomRequests, setRoomRequestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchInitiated, setFetchInitiated] = useState(false);

  console.log(roomRequests);
  useEffect(() => {
    if (!fetchInitiated) {
      setFetchInitiated(true);
      const fetchData = async () => {
        try {
          const data = await getRequestsData();
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
  }, [getRequestsData, fetchInitiated]);

  if (loading) {
    return <Loading />;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStatusIcon = (status) => {
    if (status === undefined) {
      return (
        <BsFillQuestionCircleFill className="h-5 w-5 text-yellow-500 mr-1" />
      );
    } else if (status === false) {
      return <BsXCircleFill className="h-5 w-5 text-red-500 mr-1" />;
    } else {
      return <BsCheckCircleFill className="h-5 w-5 text-green-500 mr-1" />;
    }
  };

  const handleRedirect = (id) => {
    window.open(`/room-request/${id}`, "_blank");
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Club Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Building
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Requested By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {roomRequests?.map((request) => (
              <tr key={request._id} className="border-b border-gray-200">
                <td className="px-6 py-4 whitespace-nowrap">{request.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDate(request.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {request.building}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{request.room}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {request.requestedBy.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderStatusIcon(request.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleRedirect(request._id)}
                    className="bg-primary hover:bg-primaryLight text-white font-bold py-2 px-4 rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomRequestsTable;
