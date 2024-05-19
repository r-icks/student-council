import express from "express";
import {
  findClubById,
  findRoomRequests,
  getRoomRequestById,
  updateRoomRequest,
} from "../controllers/publicController.js";
const router = express.Router();
import auth from "../middleware/auth.js";
import { getAllClubs } from "../controllers/clubController.js";

router.post("/request", auth, getRoomRequestById);
router.get("/requests", auth, findRoomRequests);
router.get("/clubs", getAllClubs);
router.post("/club", findClubById);
router.post("/update-request", auth, updateRoomRequest);
export default router;
