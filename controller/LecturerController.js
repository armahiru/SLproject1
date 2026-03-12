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

// API to get lecturer appointments
const appointmentsLecturer = async (req, res) => {
    try {
        const { userId } = req.body;
        const appointments = await appointmentModel
            .find({ lecturerId: userId })
            .populate('studentId', 'name email')
            .sort({ createdAt: -1 });

        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to approve appointment
const appointmentApprove = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (appointmentData && appointmentData.lecturerId.toString() === userId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { status: 'APPROVED' });

            // Create notification for student
            await notificationModel.create({
                userId: appointmentData.studentId,
                type: 'appointment_approved',
                message: 'Your appointment has been approved',
                status: 'UNREAD'
            });

            return res.json({ success: true, message: 'Appointment Approved' });
        }

        res.json({ success: false, message: 'Unauthorized action' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to decline appointment
const appointmentDecline = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (appointmentData && appointmentData.lecturerId.toString() === userId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { status: 'DECLINED' });

            // Create notification for student
            await notificationModel.create({
                userId: appointmentData.studentId,
                type: 'appointment_declined',
                message: 'Your appointment has been declined',
                status: 'UNREAD'
            });

            return res.json({ success: true, message: 'Appointment Declined' });
        }

        res.json({ success: false, message: 'Unauthorized action' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get all lecturers list
const lecturerList = async (req, res) => {
    try {
        const lecturers = await lecturerModel
            .find({})
            .populate('userId', 'name email');

        res.json({ success: true, lecturers });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get lecturer profile
const lecturerProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId).select('-password');
        const lecturerInfo = await lecturerModel.findOne({ userId });

        res.json({ success: true, userData, lecturerInfo });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to update lecturer profile
const updateLecturerProfile = async (req, res) => {
    try {
        const { userId, name, department, specialization, availability } = req.body;

        if (name) {
            await userModel.findByIdAndUpdate(userId, { name });
        }

        const lecturerInfo = await lecturerModel.findOne({ userId });
        if (lecturerInfo) {
            const updateData = {};
            if (department) updateData.department = department;
            if (specialization) updateData.specialization = specialization;
            if (availability) updateData.availability = availability;

            await lecturerModel.findByIdAndUpdate(lecturerInfo._id, updateData);
        }

        res.json({ success: true, message: 'Profile Updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get dashboard data
const lecturerDashboard = async (req, res) => {
    try {
        const { userId } = req.body;

        const appointments = await appointmentModel.find({ lecturerId: userId });

        const pendingCount = appointments.filter(a => a.status === 'PENDING').length;
        const approvedCount = appointments.filter(a => a.status === 'APPROVED').length;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayAppointments = appointments.filter(a => {
            const appDate = new Date(a.date);
            appDate.setHours(0, 0, 0, 0);
            return appDate.getTime() === today.getTime() && a.status === 'APPROVED';
        });

        const dashData = {
            totalAppointments: appointments.length,
            pendingRequests: pendingCount,
            approvedAppointments: approvedCount,
            todayConsultations: todayAppointments.length,
            latestAppointments: appointments.slice(0, 5)
        };

        res.json({ success: true, dashData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    appointmentsLecturer,
    appointmentApprove,
    appointmentDecline,
    lecturerList,
    lecturerDashboard,
    lecturerProfile,
    updateLecturerProfile
};