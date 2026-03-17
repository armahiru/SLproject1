import userModel from "../models/UserModels.js";
import lecturerModel from "../models/LecturerModels.js";
import studentModel from "../models/StudentModels.js";
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

        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        // Get student-specific data
        let studentInfo = await studentModel.findOne({ userId });
        if (!studentInfo) {
            // Create student record if it doesn't exist (for users registered before this update)
            studentInfo = await studentModel.create({
                userId,
                department: "",
                phone: "",
                studentId: ""
            });
        }

        // Combine user + student data
        const combined = {
            ...userData.toObject(),
            phone: studentInfo.phone,
            studentId: studentInfo.studentId,
            department: studentInfo.department
        };

        res.json({ success: true, userData: combined });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to update student profile
const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, studentId, department } = req.body;

        if (!name) {
            return res.json({ success: false, message: "Name is required" });
        }

        // Update name on user model
        await userModel.findByIdAndUpdate(userId, { name });

        // Update student-specific fields
        let studentInfo = await studentModel.findOne({ userId });
        if (!studentInfo) {
            studentInfo = await studentModel.create({ userId });
        }

        const studentUpdate = {};
        if (phone !== undefined) studentUpdate.phone = phone;
        if (studentId !== undefined) studentUpdate.studentId = studentId;
        if (department !== undefined) studentUpdate.department = department;

        await studentModel.findByIdAndUpdate(studentInfo._id, studentUpdate);

        // Return combined updated data
        const updatedUser = await userModel.findById(userId).select('-password');
        const updatedStudent = await studentModel.findOne({ userId });

        const userData = {
            ...updatedUser.toObject(),
            phone: updatedStudent.phone,
            studentId: updatedStudent.studentId,
            department: updatedStudent.department
        };

        res.json({ success: true, message: "Profile Updated", userData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API for student to book consultation appointment with lecturer
// API for student to book consultation appointment with lecturer
const bookAppointment = async (req, res) => {
    try {
        const { userId, lecturerId, date, topic, meetingType } = req.body;

        if (!lecturerId || !date) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        // Validate meeting type
        if (meetingType && !['online', 'in-person'].includes(meetingType)) {
            return res.json({ success: false, message: "Invalid meeting type" });
        }

        // Find lecturer info
        const lecturerInfo = await lecturerModel.findOne({ userId: lecturerId });
        if (!lecturerInfo) {
            return res.json({ success: false, message: "Lecturer not found" });
        }

        // Validate against lecturer's availability
        const requestedDate = new Date(date);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const requestedDay = dayNames[requestedDate.getDay()];
        const requestedTime = requestedDate.toTimeString().slice(0, 5); // "HH:MM"

        if (lecturerInfo.availability && lecturerInfo.availability.length > 0) {
            const matchingSlot = lecturerInfo.availability.find(slot =>
                slot.day === requestedDay &&
                requestedTime >= slot.startTime &&
                requestedTime < slot.endTime
            );
            if (!matchingSlot) {
                return res.json({ success: false, message: "Selected time is outside the lecturer's available hours" });
            }
        }

        const appointmentData = {
            studentId: userId,
            lecturerId,
            date: new Date(date),
            topic: topic || "",
            meetingType: meetingType || 'in-person',
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