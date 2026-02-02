import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/MongoDB.js";
import StudentRouter from "./routes/StudentRoute.js";
import LecturerRouter from "./routes/LecturerRoute.js";
import AuthRouter from "./routes/AuthRoute.js";

// app config
const app = express();
const port = process.env.PORT || 3000;
connectDB();
const studentRouter = StudentRouter;
const lecturerRouter = LecturerRouter;
const authRouter = AuthRouter;
// middlewares
app.use(express.json());
app.use(cors());

// api endpoints (student & lecturer only)
app.use("/api/student", studentRouter);
app.use("/api/lecturer", lecturerRouter);
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send(
    "Student–Lecturer Consultation API (no admin, images removed; DB only for basic data)"
  );
});

app.listen(port, () => console.log(`Server started on PORT:${port}`));