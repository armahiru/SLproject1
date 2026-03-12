import express from "express";
import { getStudentDashboard, getLecturerDashboard } from "../controller/DashboardController.js";
import authMiddleware from "../middleware/AuthStudent.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/student", authMiddleware, getStudentDashboard);
dashboardRouter.get("/lecturer", authMiddleware, getLecturerDashboard);

export default dashboardRouter;
