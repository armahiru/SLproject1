import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/MongoDB.js";
import authRouter from "./routes/AuthRoute.js";
import studentRouter from "./routes/StudentRoute.js";
import lecturerRouter from "./routes/LecturerRoute.js";
import notificationRouter from "./routes/NotificationRoute.js";
import scheduleRouter from "./routes/ScheduleRoute.js";
import dashboardRouter from "./routes/DashboardRoute.js";

// app config
const app = express();
const port = process.env.PORT || 3000;
connectDB();

// middlewares
app.use(express.json());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// api endpoints
app.use("/api/auth", authRouter);
app.use("/api/student", studentRouter);
app.use("/api/lecturer", lecturerRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/schedule", scheduleRouter);
app.use("/api/dashboard", dashboardRouter);

app.get("/", (req, res) => {
  res.send("UniConsult Backend API - MongoDB");
});

app.listen(port, () => console.log(`Server started on PORT:${port}`));