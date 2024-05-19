import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useAppContext } from "../../context/appContext";

const RoomAllocationForm = () => {
  const { buildingAndRoomsData, getRoomsInfo, loading, requestRoom } =
    useAppContext();
  const [functionType, setFunctionType] = useState("");
  const [otherFunctionType, setOtherFunctionType] = useState("");
  const [pointOfContact, setPointOfContact] = useState({
    name: "",
    registrationNumber: "",
    contactNumber: "",
  });
  const [purpose, setPurpose] = useState("");
  const [date, setDate] = useState("");
  const [equipment, setEquipment] = useState([]);
  const [place, setPlace] = useState({
    building: "",
    roomNumber: "",
  });
  const [agreeToConditions, setAgreeToConditions] = useState(false);
  const [functionDescriptionDocument, setFunctionDescriptionDocument] =
    useState(null);
  const [otherEquipmentName, setOtherEquipmentName] = useState("");
  const [otherEquipmentChecked, setOtherEquipmentChecked] = useState(false);

  const handleFunctionTypeChange = (value) => {
    setFunctionType(value);
    if (value !== "other") {
      setOtherFunctionType("");
    }
  };

  const handleOtherFunctionTypeChange = (value) => {
    setOtherFunctionType(value);
    setFunctionType("other");
  };

  const handlePointOfContactChange = (field, value) => {
    setPointOfContact((prev) => ({ ...prev, [field]: value }));
  };

  const handleEquipmentChange = (item) => {
    if (item === "otherEquipment") {
      setOtherEquipmentChecked(!otherEquipmentChecked);
    } else {
      if (equipment.includes(item)) {
        setEquipment((prev) => prev.filter((equipment) => equipment !== item));
      } else {
        setEquipment((prev) => [...prev, item]);
      }
    }
  };

  const handleOtherEquipmentNameChange = (e) => {
    setOtherEquipmentName(e.target.value);
  };

  const handleOtherEquipmentCheckboxChange = () => {
    setOtherEquipmentChecked(!otherEquipmentChecked);
  };

  const handlePlaceChange = (building, roomNumber) => {
    setPlace({ building, roomNumber });
  };

  const handleSubmit = () => {
    const equipmentArray = otherEquipmentChecked
      ? [...equipment, otherEquipmentName]
      : equipment;

    const requestData = new FormData();
    requestData.append(
      "functionType",
      functionType === "other" ? otherFunctionType : functionType
    );
    requestData.append("pointOfContact", JSON.stringify(pointOfContact));
    requestData.append("purpose", purpose);
    requestData.append("date", date);
    requestData.append(
      "functionDescriptionDocument",
      functionDescriptionDocument
    );

    equipmentArray.forEach((equipmentItem, index) => {
      requestData.append(`equipmentRequired[${index}]`, equipmentItem);
    });

    requestData.append(
      "placeRequired",
      JSON.stringify({
        building: place.building,
        roomNumber: place.roomNumber,
      })
    );

    requestRoom(requestData);
  };

  const onDrop = (acceptedFiles) => {
    // Assume only one file is accepted
    const file = acceptedFiles[0];
    setFunctionDescriptionDocument(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".pdf",
    maxSize: 10 * 1024 * 1024, // 10 MB
  });

  const handleSetDate = async (date) => {
    setDate(date);
    await getRoomsInfo(date);
  };

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg">
      <h1 className="text-3xl font-semibold mb-6">ACM Manipal</h1>
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block mb-2 text-gray-700">Function Type</label>
          <select
            value={functionType}
            disabled={loading}
            onChange={(e) => handleFunctionTypeChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary"
          >
            <option value="">Select...</option>
            <option value="type1">Type 1</option>
            <option value="type2">Type 2</option>
            <option value="other">Other</option>
          </select>
          {functionType === "other" && (
            <input
              type="text"
              placeholder="Enter other type"
              value={otherFunctionType}
              onChange={(e) => handleOtherFunctionTypeChange(e.target.value)}
              className="w-full mt-2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary"
            />
          )}
        </div>

        <div className="col-span-2 grid sm:grid-cols-2 gap-x-6 gap-y-2">
          <label className="col-span-2 block mb-2 text-gray-700">
            Point of Contact Details
          </label>
          <div className="col-span-1 sm:col-span-1">
            <input
              type="text"
              placeholder="Name"
              value={pointOfContact.name}
              onChange={(e) =>
                handlePointOfContactChange("name", e.target.value)
              }
              className="w-full mb-2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <input
              type="text"
              placeholder="Registration Number"
              value={pointOfContact.registrationNumber}
              onChange={(e) =>
                handlePointOfContactChange("registrationNumber", e.target.value)
              }
              className="w-full mb-2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <input
              type="text"
              placeholder="Contact Number"
              value={pointOfContact.contactNumber}
              onChange={(e) =>
                handlePointOfContactChange("contactNumber", e.target.value)
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary"
            />
          </div>
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-gray-700">Purpose</label>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary"
          />
        </div>

        <div className="col-span-2 ">
          <label className="block mb-2 text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => handleSetDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-secondary appearance-none"
            min={new Date().toISOString().split("T")[0]} // Minimum date is today
          />
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-gray-700">Equipment Required</label>
          <div className="flex flex-wrap">
            <div className="flex items-center mr-4 mb-2">
              <input
                type="checkbox"
                id="projector"
                checked={equipment.includes("projector")}
                onChange={() => handleEquipmentChange("projector")}
                className="mr-2"
              />
              <label htmlFor="projector">Projector</label>
            </div>
            <div className="flex items-center mr-4 mb-2">
              <input
                type="checkbox"
                id="otherEquipment"
                checked={otherEquipmentChecked}
                onChange={() => handleEquipmentChange("otherEquipment")}
                className="mr-2"
              />
              <label htmlFor="otherEquipment">Other</label>
              {otherEquipmentChecked && (
                <input
                  type="text"
                  placeholder="Enter other equipment"
                  value={otherEquipmentName}
                  onChange={handleOtherEquipmentNameChange}
                  className="ml-2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary"
                />
              )}
            </div>
            {/* Add more equipment checkboxes as needed */}
          </div>
        </div>

        {buildingAndRoomsData && (
          <div className="col-span-2 grid sm:grid-cols-2 gap-x-6 gap-y-2">
            <label className="col-span-2 block mb-2 text-gray-700">
              Place Required
            </label>
            <select
              value={place.building}
              onChange={(e) => handlePlaceChange(e.target.value, "")}
              className="col-span-2 sm:col-span-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary"
            >
              <option value="">Building</option>
              {buildingAndRoomsData.map((buildingData) => (
                <option
                  key={buildingData.building}
                  value={buildingData.building}
                >
                  {buildingData.building}
                </option>
              ))}
            </select>
            <select
              value={place.roomNumber}
              onChange={(e) =>
                handlePlaceChange(place.building, e.target.value)
              }
              className="col-span-2 sm:col-span-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary"
              disabled={!place.building}
            >
              <option value="">Room Number</option>
              {buildingAndRoomsData
                .find(
                  (buildingData) => buildingData.building === place.building
                )
                ?.rooms.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div className="col-span-2">
          <label className="block mb-2 text-gray-700">
            Function Description Document (PDF, up to 10 MB)
          </label>
          <div
            {...getRootProps()}
            className="w-full h-32 border border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer"
          >
            <input {...getInputProps()} />
            {functionDescriptionDocument ? (
              <p className="text-gray-700">
                {functionDescriptionDocument.name}
              </p>
            ) : (
              <p className="text-gray-500">
                Drag 'n' drop or click to select a file
              </p>
            )}
          </div>
        </div>

        <div className="col-span-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="agreeToConditions"
              checked={agreeToConditions}
              onChange={() => setAgreeToConditions(!agreeToConditions)}
              className="mr-2"
            />
            <label htmlFor="agreeToConditions">
              I agree to the terms and conditions given, and if any purpose
              college requires the above place, this request will be changed to
              another place or canceled.
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-primary text-white rounded-full focus:outline-none hover:bg-primaryLight transition duration-300"
          disabled={!agreeToConditions}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default RoomAllocationForm;
