import userModel from "../models/UserModels.js";
import lecturerModel from "../models/LecturerModels.js";
import appointmentModel from "../models/AppointmentModels.js";
import notificationModel from "../models/NotificationModels.js";
import mongoose from "mongoose";
import { sendAppointmentApprovedEmail, sendAppointmentDeclinedEmail, sendZoomLinkEmail } from "../config/nodemailer.js";

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

            // Send email notification to student
            try {
                const studentUser = await userModel.findById(appointmentData.studentId);
                const lecturerUser = await userModel.findById(userId);
                if (studentUser?.email) {
                    await sendAppointmentApprovedEmail(
                        studentUser.email,
                        studentUser.name,
                        lecturerUser?.name || 'Lecturer',
                        appointmentData.date,
                        appointmentData.topic,
                        appointmentData.meetingType
                    );
                }
            } catch (emailErr) { console.error('Failed to send approval email:', emailErr); }

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

            // Send email notification to student
            try {
                const studentUser = await userModel.findById(appointmentData.studentId);
                const lecturerUser = await userModel.findById(userId);
                if (studentUser?.email) {
                    await sendAppointmentDeclinedEmail(
                        studentUser.email,
                        studentUser.name,
                        lecturerUser?.name || 'Lecturer',
                        appointmentData.date,
                        appointmentData.topic
                    );
                }
            } catch (emailErr) { console.error('Failed to send decline email:', emailErr); }

            return res.json({ success: true, message: 'Appointment Declined' });
        }

        res.json({ success: false, message: 'Unauthorized action' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
// API to update zoom link for appointment
const updateZoomLink = async (req, res) => {
    try {
        const { userId, appointmentId, zoomLink } = req.body;

        if (!appointmentId || !zoomLink) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        if (appointmentData.lecturerId.toString() !== userId) {
            return res.json({ success: false, message: "Unauthorized action" });
        }

        if (appointmentData.meetingType !== 'online') {
            return res.json({ success: false, message: "Can only add zoom link to online meetings" });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { zoomLink });

        // Create notification for student
        await notificationModel.create({
            userId: appointmentData.studentId,
            type: 'zoom_link_added',
            message: 'Zoom link has been added to your appointment',
            status: 'UNREAD'
        });

        // Send email notification to student with zoom link
        try {
            const studentUser = await userModel.findById(appointmentData.studentId);
            const lecturerUser = await userModel.findById(userId);
            if (studentUser?.email) {
                await sendZoomLinkEmail(
                    studentUser.email,
                    studentUser.name,
                    lecturerUser?.name || 'Lecturer',
                    appointmentData.date,
                    zoomLink
                );
            }
        } catch (emailErr) { console.error('Failed to send zoom link email:', emailErr); }

        res.json({ success: true, message: "Zoom link updated successfully" });
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
// API to get a specific lecturer's availability
const lecturerAvailability = async (req, res) => {
    try {
        const { lecturerId } = req.params;
        const lecturerInfo = await lecturerModel.findOne({ userId: lecturerId });
        if (!lecturerInfo) {
            return res.json({ success: false, message: "Lecturer not found" });
        }
        res.json({ success: true, availability: lecturerInfo.availability || [] });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get lecturer profile
// API to get lecturer profile
// API to get lecturer profile
const lecturerProfile = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.json({ success: false, message: "User ID not found" });
        }

        const userData = await userModel.findById(userId).select('-password');
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        let lecturerInfo = await lecturerModel.findOne({ userId });

        // If lecturer info doesn't exist, create a basic one
        if (!lecturerInfo) {
            lecturerInfo = await lecturerModel.create({
                userId,
                department: '',
                specialization: '',
                availability: []
            });
        }

        // Combine the data into a single lecturer object
        const lecturer = {
            ...lecturerInfo.toObject(),
            userId: userData
        };

        res.json({ success: true, lecturer });
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
            if (department !== undefined) updateData.department = department;
            if (specialization !== undefined) updateData.specialization = specialization;
            if (availability) updateData.availability = availability;

            await lecturerModel.findByIdAndUpdate(lecturerInfo._id, updateData);
        }

        // Re-fetch the full profile to return
        const userData = await userModel.findById(userId).select('-password');
        const updatedLecturer = await lecturerModel.findOne({ userId });
        const lecturer = {
            ...updatedLecturer.toObject(),
            userId: userData
        };

        res.json({ success: true, message: 'Profile Updated', lecturer });
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

// API to upload profile photo
const uploadPhoto = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!req.file) {
            return res.json({ success: false, message: "No image file provided" });
        }

        // Convert to base64 data URL
        const base64 = req.file.buffer.toString('base64');
        const dataUrl = `data:${req.file.mimetype};base64,${base64}`;

        await userModel.findByIdAndUpdate(userId, { image: dataUrl });

        res.json({ success: true, message: "Photo uploaded successfully", image: dataUrl });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    appointmentsLecturer,
    appointmentApprove,
    appointmentDecline,
    updateZoomLink,
    lecturerList,
    lecturerAvailability,
    lecturerDashboard,
    lecturerProfile,
    updateLecturerProfile,
    uploadPhoto
};