import express from "express";
import { getStudentSchedule, getLecturerSchedule } from "../controller/ScheduleController.js";
import authMiddleware from "../middleware/AuthStudent.js";

const scheduleRouter = express.Router();

scheduleRouter.get("/student", authMiddleware, getStudentSchedule);
scheduleRouter.get("/lecturer", authMiddleware, getLecturerSchedule);

export default scheduleRouter;
