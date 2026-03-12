import userModel from "../models/UserModels.js";
import lecturerModel from "../models/LecturerModels.js";
import appointmentModel from "../models/AppointmentModels.js";
import notificationModel from "../models/NotificationModels.js";
import mongoose from "mongoose";

function ensureDbConnected(res) {
    if (mongoose.connection?.readyState !== 1) {
        res.status(503).json({
            success: false,
            message: "Database is disabled/not connected right now.",
        });
        return false;
    }
    return true;
}

// Note: register and login moved to AuthController

// API to get student profile data
const getProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId).select('-password');

        res.json({ success: true, userData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to update student profile
const updateProfile = async (req, res) => {
    try {
        const { userId, name } = req.body;

        if (!name) {
            return res.json({ success: false, message: "Name is required" });
        }

        await userModel.findByIdAndUpdate(userId, { name });

        res.json({ success: true, message: "Profile Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API for student to book consultation appointment with lecturer
const bookAppointment = async (req, res) => {
    try {
        const { userId, lecturerId, date, topic } = req.body;

        if (!lecturerId || !date) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        // Find lecturer info
        const lecturerInfo = await lecturerModel.findOne({ userId: lecturerId });
        if (!lecturerInfo) {
            return res.json({ success: false, message: "Lecturer not found" });
        }

        const appointmentData = {
            studentId: userId,
            lecturerId,
            date: new Date(date),
            topic: topic || "",
            status: 'PENDING'
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        // Create notification for lecturer
        await notificationModel.create({
            userId: lecturerId,
            type: 'appointment_request',
            message: 'New appointment request received',
            status: 'UNREAD'
        });

        res.json({ success: true, message: "Appointment request sent" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' });
        }

        if (appointmentData.studentId.toString() !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { status: 'DECLINED' });

        // Create notification for lecturer
        await notificationModel.create({
            userId: appointmentData.lecturerId,
            type: 'appointment_cancelled',
            message: 'Student cancelled an appointment',
            status: 'UNREAD'
        });

        res.json({ success: true, message: 'Appointment Cancelled' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get student appointments
const listAppointment = async (req, res) => {
    try {
        const { userId } = req.body;
        const appointments = await appointmentModel
            .find({ studentId: userId })
            .populate('lecturerId', 'name email')
            .sort({ createdAt: -1 });

        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment
};