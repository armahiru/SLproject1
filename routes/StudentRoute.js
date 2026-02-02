import express from "express";
import {
  loginStudent,
  registerStudent,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
} from "../controller/StudentController.js";
import AuthStudent from "../middleware/AuthStudent.js";

const studentRouter = express.Router();

studentRouter.post("/register", registerStudent);
studentRouter.post("/login", loginStudent);

studentRouter.get("/get-profile", AuthStudent, getProfile);
studentRouter.post("/update-profile", AuthStudent, updateProfile);
studentRouter.post("/book-appointment", AuthStudent, bookAppointment);
studentRouter.get("/appointments", AuthStudent, listAppointment);
studentRouter.post("/cancel-appointment", AuthStudent, cancelAppointment);
export default studentRouter;