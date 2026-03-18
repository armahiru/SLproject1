import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/MongoDB.js";
import transporter from "./config/nodemailer.js";
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

// Test email endpoint - visit /test-email to check if email sending works
app.get("/test-email", async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: `"UniConsult" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "UniConsult Email Test",
      html: "<h2>Email is working!</h2><p>If you see this, your email config is correct.</p>"
    });
    res.json({ success: true, message: "Test email sent!", messageId: info.messageId });
  } catch (error) {
    res.json({ success: false, message: error.message, code: error.code });
  }
});

app.listen(port, () => {
  console.log(`Server started on PORT:${port}`);
  // Connect to MongoDB after server is listening (non-blocking)
  connectDB();
});