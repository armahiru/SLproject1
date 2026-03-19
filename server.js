import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/MongoDB.js";
import emailService from "./config/nodemailer.js";
import authRouter from "./routes/AuthRoute.js";
import studentRouter from "./routes/StudentRoute.js";
import lecturerRouter from "./routes/LecturerRoute.js";
import notificationRouter from "./routes/NotificationRoute.js";
import scheduleRouter from "./routes/ScheduleRoute.js";
import dashboardRouter from "./routes/DashboardRoute.js";

// app config
const app = express();
const port = process.env.PORT || 3000;

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

// Test email endpoint
app.get("/test-email", async (req, res) => {
  try {
    const result = await emailService.sendEmail(
      process.env.SENDER_EMAIL || 'uniconsult2@gmail.com',
      "UniConsult Email Test",
      "<h2>Email is working!</h2><p>If you see this, Brevo email is configured correctly on Render.</p>"
    );
    res.json(result);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server started on PORT:${port}`);
  // Connect to MongoDB after server is listening (non-blocking)
  connectDB();
});