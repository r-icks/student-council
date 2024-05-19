import { StatusCodes } from "http-status-codes";
import Club from "../models/Club.js";
import {
  uploadFunctionDescription,
  uploadLogoTos3,
  uploadVideoTos3,
} from "../services/s3.js";
import BadRequestError from "../Errors/bad-request.js";
import NotFoundError from "../Errors/not-found.js";
import RoomRequest from "../models/RoomRequest.js";
import { sendNotificationMail } from "../services/nodemailer.js";
import User from "../models/User.js";

export const editClubProfile = async (req, res) => {
  const { tagLine, fullName, description } = req.body;
  const logo = req.files?.logo?.[0];
  const video = req.files?.video?.[0];

  if (logo && !logo.mimetype.startsWith("image")) {
    throw new BadRequestError("Logo must be in JPEG format");
  }

  if (video && !video.mimetype.startsWith("video")) {
    throw new BadRequestError("Video must be in MP4 format");
  }

  const club = await Club.findById(req.user.userId);
  if (!club) {
    throw new NotFoundError("Club not found");
  }
  if (tagLine) club.tagLine = tagLine;
  if (fullName) club.fullName = fullName;
  if (description) club.description = description;
  if (logo) {
    const logoKey = await uploadLogoTos3({
      file: logo,
      clubId: req.user.userId,
    });
    club.logo = logoKey.key;
  }
  if (video) {
    const videoKey = await uploadVideoTos3({
      file: video,
      clubId: req.user.userId,
    });
    club.video = videoKey.key;
  }
  await club.save();
  res
    .status(StatusCodes.OK)
    .json({ msg: "Club profile updated successfully", club });
};

export const findAvailableRooms = async (req, res) => {
  const { date } = req.body;

  if (!date) {
    throw new BadRequestError("Please provide date");
  }

  const buildingAndRooms = [
    { building: "Building A", rooms: ["Room 101", "Room 102", "Room 103"] },
    { building: "Building B", rooms: ["Room 201", "Room 202", "Room 203"] },
  ];

  const roomRequests = await RoomRequest.find({ date });

  roomRequests.forEach((request) => {
    const { building, roomNumber } = request.placeRequired;
    const buildingIndex = buildingAndRooms.findIndex(
      (b) => b.building === building
    );
    if (buildingIndex !== -1) {
      buildingAndRooms[buildingIndex].rooms = buildingAndRooms[
        buildingIndex
      ].rooms.filter((r) => r !== roomNumber);
    }
  });

  const filteredBuildings = buildingAndRooms.filter(
    (building) => building.rooms.length > 0
  );

  res.status(StatusCodes.OK).json({ buildingAndRoomsData: filteredBuildings });
};

export const createRoomAllocationRequest = async (req, res) => {
  const functionDescription = req.file;

  const {
    functionType,
    pointOfContact: pc,
    purpose,
    equipmentRequired,
    placeRequired: pr,
    date,
  } = req.body;

  const placeRequired = JSON.parse(pr);
  const pointOfContact = JSON.parse(pc);

  const { building, roomNumber: room } = placeRequired;

  if (
    !date ||
    !functionType ||
    !pointOfContact ||
    !purpose ||
    !building ||
    !room
  ) {
    throw new BadRequestError("Please provide all required data");
  }

  const club = await Club.findById(req.user.userId);
  if (!club) {
    throw new BadRequestError("Club not found");
  }

  const roomRequest = new RoomRequest({
    requestedBy: club._id,
    functionType,
    pointOfContact,
    purpose,
    equipmentRequired,
    placeRequired,
    date,
  });

  await roomRequest.save();

  if (functionDescription) {
    const { key } = await uploadFunctionDescription({
      file: functionDescription,
      requestId: roomRequest._id,
    });
    roomRequest.functionDescription = key;
    await roomRequest.save();
  }

  const fa = await User.findOne({ email: club.faemail });

  await sendNotificationMail({
    email: club.faemail,
    requestId: roomRequest._id,
    clubName: club.name,
    building: roomRequest.placeRequired.building,
    room: roomRequest.placeRequired.roomNumber,
    name: fa.name,
  });

  res.status(StatusCodes.OK).json({ msg: "Room Requested Successfully" });
};

export const getAllClubs = async (req, res) => {
  const clubs = await Club.find({ logo: { $ne: null, $exists: true } });

  const clubsData = clubs.map((club) => ({
    _id: club._id,
    name: club.name,
    logo: club.logo,
    tagline: club.tagLine,
  }));

  res.status(StatusCodes.OK).json({ clubs: clubsData });
};
