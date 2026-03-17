import express from "express";
import multer from "multer";
import {
  appointmentsLecturer,
  appointmentApprove,
  appointmentDecline,
  updateZoomLink,
  lecturerList,
  lecturerAvailability,
  lecturerDashboard,
  lecturerProfile,
  updateLecturerProfile,
  uploadPhoto,
} from "../controller/LecturerController.js";
import authMiddleware from "../middleware/AuthLecturer.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const lecturerRouter = express.Router();

lecturerRouter.get("/list", lecturerList);
lecturerRouter.get("/availability/:lecturerId", lecturerAvailability);
lecturerRouter.get("/appointments", authMiddleware, appointmentsLecturer);
lecturerRouter.post("/approve-appointment", authMiddleware, appointmentApprove);
lecturerRouter.post("/decline-appointment", authMiddleware, appointmentDecline);
lecturerRouter.post("/update-zoom-link", authMiddleware, updateZoomLink);
lecturerRouter.get("/dashboard", authMiddleware, lecturerDashboard);
lecturerRouter.get("/profile", authMiddleware, lecturerProfile);
lecturerRouter.post("/update-profile", authMiddleware, updateLecturerProfile);
lecturerRouter.post("/upload-photo", authMiddleware, upload.single('image'), uploadPhoto);

export default lecturerRouter;