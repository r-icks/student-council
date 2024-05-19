import express from "express";
import multer from "multer";
import {
  createRoomAllocationRequest,
  editClubProfile,
  findAvailableRooms,
} from "../controllers/clubController.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/editProfile",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  editClubProfile
);

router.post("/room", findAvailableRooms);
router.post(
  "/request",
  upload.single("functionDescriptionDocument"),
  createRoomAllocationRequest
);

export default router;
