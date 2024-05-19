import { BadRequestError, NotFoundError } from "../Errors/index.js";
import RoomRequest from "../models/RoomRequest.js";
import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import {
  roomApprovedMail,
  roomDeclinedMail,
  sendNotificationMail,
} from "../services/nodemailer.js";
import Club from "../models/Club.js";

export const getRoomRequestById = async (req, res) => {
  const { requestId } = req.body;

  if (!requestId) {
    throw new BadRequestError("Request ID is missing");
  }

  if (
    !requestId ||
    typeof requestId !== "string" ||
    requestId.length !== 24 ||
    !/^[0-9a-fA-F]{24}$/.test(requestId)
  ) {
    throw new BadRequestError("Invalid Request ID format");
  }

  const roomRequest = await RoomRequest.findById(requestId)
    .populate("requestedBy", "name logo faemail")
    .exec();

  if (!roomRequest) {
    throw new NotFoundError("Room Request not found");
  }

  const {
    requestedBy,
    functionType,
    pointOfContact,
    purpose,
    equipmentRequired,
    placeRequired,
    functionDescription,
    date,
    approvals,
  } = roomRequest;

  res.status(StatusCodes.OK).json({
    roomRequestData: {
      clubName: requestedBy.name,
      clubLogo: requestedBy.logo,
      faemail: requestedBy.faemail,
      functionType,
      pointOfContact,
      purpose,
      equipmentRequired,
      placeRequired,
      functionDescription,
      date,
      approvals,
    },
  });
};

export const updateRoomRequest = async (req, res) => {
  const { requestId, approved, remarks } = req.body;
  const roomRequest = await RoomRequest.findById(requestId).populate(
    "requestedBy",
    "faemail name email"
  );
  if (!roomRequest) {
    throw new BadRequestError("Room Request not found");
  }
  if (req.user.userRole === "admin" || req.user.userRole === "swo") {
    if (!roomRequest?.approvals?.facultyAdvisor?.approved) {
      throw new BadRequestError(
        "Needs to be approved by faculty advisor first"
      );
    }
    roomRequest.approvals.swo.approved = approved;
    roomRequest.approvals.swo.remarks = remarks;
    await roomRequest.save();
    const users = await User.find({ role: "security" }, { email: 1, _id: 0 });
    const emails = users.map((user) => user.email);
    if (approved) {
      await sendNotificationMail({
        email: emails,
        requestId: roomRequest._id,
        clubName: roomRequest.requestedBy.name,
        building: roomRequest.placeRequired.building,
        room: roomRequest.placeRequired.roomNumber,
        name: "Security",
      });
    } else {
      await roomDeclinedMail({
        email: roomRequest.requestedBy.email,
        name: roomRequest.requestedBy.name,
        requestId: roomRequest._id,
        building: roomRequest.placeRequired.building,
        room: roomRequest.placeRequired.roomNumber,
      });
    }
    res.status(StatusCodes.OK).json("Request Approved by Student Welfare");
  }
  if (req.user.userRole === "fa") {
    const fa = await User.findOne({ email: roomRequest.requestedBy.faemail });
    if (!fa) {
      throw new BadRequestError("FA not found");
    }
    if (fa._id.toString() !== req.user.userId) {
      throw new BadRequestError("Authentication Error");
    }
    roomRequest.approvals.facultyAdvisor.approved = approved;
    roomRequest.approvals.facultyAdvisor.remarks = remarks;
    await roomRequest.save();
    const users = await User.find(
      { $or: [{ role: "admin" }, { role: "swo" }] },
      { email: 1, _id: 0 }
    );
    const emails = users.map((user) => user.email);
    if (approved) {
      await sendNotificationMail({
        email: emails,
        requestId: roomRequest._id,
        clubName: roomRequest.requestedBy.name,
        building: roomRequest.placeRequired.building,
        room: roomRequest.placeRequired.roomNumber,
        name: "Student Welfare",
      });
    } else {
      await roomDeclinedMail({
        email: roomRequest.requestedBy.email,
        name: roomRequest.requestedBy.name,
        requestId: roomRequest._id,
        building: roomRequest.placeRequired.building,
        room: roomRequest.placeRequired.roomNumber,
      });
    }
    res.status(StatusCodes.OK).json("Request Approved by Faculty Advisor");
  }
  if (req.user.userRole === "security") {
    if (!roomRequest?.approvals?.swo?.approved) {
      throw new BadRequestError(
        "Needs to be approved by student welfare first"
      );
    }
    roomRequest.approvals.security.approved = approved;
    roomRequest.approvals.security.remarks = remarks;
    await roomRequest.save();
    if (approved) {
      await roomApprovedMail({
        email: roomRequest.requestedBy.email,
        name: roomRequest.requestedBy.name,
        requestId: roomRequest._id,
        building: roomRequest.placeRequired.building,
        room: roomRequest.placeRequired.roomNumber,
      });
    } else {
      console.log("hello");
      await roomDeclinedMail({
        email: roomRequest.requestedBy.email,
        name: roomRequest.requestedBy.name,
        requestId: roomRequest._id,
        building: roomRequest.placeRequired.building,
        room: roomRequest.placeRequired.roomNumber,
      });
    }
    res.status(StatusCodes.OK).json("Request Approved by Security");
  }
  throw new BadRequestError("Invalid Role");
};

export const findRoomRequests = async (req, res) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  let addQuery = {};
  if (req.user.userRole === "club") {
    addQuery = { requestedBy: req.user.userId };
  }
  if (req.user.userRole === "fa") {
    const fa = await User.findById(req.user.userId);
    const clubs = await Club.find({ faemail: fa.email }).select("_id");
    const clubIds = clubs.map((club) => club._id);
    addQuery = { requestedBy: { $in: clubIds } };
  }
  const roomRequests = await RoomRequest.find({
    $and: [{ date: { $gte: yesterday } }, addQuery],
  })
    .populate("requestedBy", "name")
    .select(
      "_id date placeRequired.building placeRequired.roomNumber approvals.swo.approved approvals.facultyAdvisor.approved approvals.security.approved requestedBy"
    );

  const processedRequests = roomRequests.map((request) => {
    const { _id, date, placeRequired, approvals, requestedBy } = request;
    const status =
      approvals.swo.approved &&
      approvals.facultyAdvisor.approved &&
      approvals.security.approved
        ? true
        : approvals.swo.approved === false ||
          approvals.facultyAdvisor.approved === false ||
          approvals.security.approved === false
        ? false
        : undefined;
    return {
      _id,
      name: request.requestedBy.name,
      date,
      building: placeRequired.building,
      room: placeRequired.roomNumber,
      status,
      requestedBy,
    };
  });

  res.status(StatusCodes.OK).json({ roomRequests: processedRequests });
};

export const findClubById = async (req, res) => {
  const { clubId } = req.body;

  if (!clubId) {
    throw new BadRequestError("No club id");
  }

  if (
    !clubId ||
    typeof clubId !== "string" ||
    clubId.length !== 24 ||
    !/^[0-9a-fA-F]{24}$/.test(clubId)
  ) {
    throw new BadRequestError("Invalid Request ID format");
  }

  const club = await Club.findById(clubId);

  if (!club) {
    throw new BadRequestError("Club details not found");
  }

  res.status(StatusCodes.OK).json({
    clubProfile: {
      name: club.name,
      fullName: club.fullName,
      logo: club.logo,
      video: club.video,
      email: club.email,
      tagline: club.tagLine,
      description: club.description,
    },
  });
};
