import express from "express";
import { getNotifications, markAsRead } from "../controller/NotificationController.js";
import authMiddleware from "../middleware/AuthStudent.js";

const notificationRouter = express.Router();

notificationRouter.get("/", authMiddleware, getNotifications);
notificationRouter.put("/:id/read", authMiddleware, markAsRead);

export default notificationRouter;
