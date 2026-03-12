import express from "express";
import {
  appointmentsLecturer,
  appointmentApprove,
  appointmentDecline,
  lecturerList,
  lecturerDashboard,
  lecturerProfile,
  updateLecturerProfile,
} from "../controller/LecturerController.js";
import authMiddleware from "../middleware/AuthLecturer.js";

const lecturerRouter = express.Router();

lecturerRouter.get("/list", lecturerList);
lecturerRouter.get("/appointments", authMiddleware, appointmentsLecturer);
lecturerRouter.post("/approve-appointment", authMiddleware, appointmentApprove);
lecturerRouter.post("/decline-appointment", authMiddleware, appointmentDecline);
lecturerRouter.get("/dashboard", authMiddleware, lecturerDashboard);
lecturerRouter.get("/profile", authMiddleware, lecturerProfile);
lecturerRouter.post("/update-profile", authMiddleware, updateLecturerProfile);

export default lecturerRouter;