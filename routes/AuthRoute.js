import express from "express";
import { registerStudent } from "../controller/StudentController.js";
import { registerLecturer } from "../controller/LecturerController.js";

const authRouter = express.Router();

// Unified register:
// POST /api/auth/register  { role: "student" | "lecturer", ... }
authRouter.post("/register", async (req, res) => {
  const role = (req.body?.role || "").toString().toLowerCase();

  if (role === "student") return registerStudent(req, res);
  if (role === "lecturer") return registerLecturer(req, res);

  return res.status(400).json({
    success: false,
    message: "Invalid role. Use role: 'student' or 'lecturer'.",
  });
});

export default authRouter;

