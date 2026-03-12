import express from "express";
import {
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
} from "../controller/StudentController.js";
import authMiddleware from "../middleware/AuthStudent.js";

const studentRouter = express.Router();

studentRouter.get("/get-profile", authMiddleware, getProfile);
studentRouter.post("/update-profile", authMiddleware, updateProfile);
studentRouter.post("/book-appointment", authMiddleware, bookAppointment);
studentRouter.get("/appointments", authMiddleware, listAppointment);
studentRouter.post("/cancel-appointment", authMiddleware, cancelAppointment);

export default studentRouter;