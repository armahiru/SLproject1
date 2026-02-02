import express from "express";
import {
  registerLecturer,
  loginLecturer,
  appointmentsLecturer,
  appointmentCancel,
  lecturerList,
  changeAvailablity,
  appointmentComplete,
  lecturerDashboard,
  lecturerProfile,
  updateLecturerProfile,
} from "../controller/LecturerController.js";
import AuthLecturer from "../middleware/AuthLecturer.js";
const lecturerRouter = express.Router();

lecturerRouter.post("/register", registerLecturer);
lecturerRouter.post("/login", loginLecturer);
lecturerRouter.post("/cancel-appointment", AuthLecturer, appointmentCancel);
lecturerRouter.get("/appointments", AuthLecturer, appointmentsLecturer);
lecturerRouter.get("/list", lecturerList);
lecturerRouter.post("/change-availability", AuthLecturer, changeAvailablity);
lecturerRouter.post("/complete-appointment", AuthLecturer, appointmentComplete);
lecturerRouter.get("/dashboard", AuthLecturer, lecturerDashboard);
lecturerRouter.get("/profile", AuthLecturer, lecturerProfile);
lecturerRouter.post("/update-profile", AuthLecturer, updateLecturerProfile);
export default lecturerRouter;