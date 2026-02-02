import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import lecturerModel from "../models/LecturerModels.js";
import appointmentModel from "../models/AppointmentModels.js";
import validator from "validator";
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

// API for lecturer registration
const registerLecturer = async (req, res) => {
    try {
        if (!ensureDbConnected(res)) return;

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        const existing = await lecturerModel.findOne({ email });
        if (existing) {
            return res.json({ success: false, message: "Lecturer already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const lecturer = await lecturerModel.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign({ id: lecturer._id }, process.env.JWT_SECRET);
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API for lecturer login 
const loginLecturer = async (req, res) => {

    try {

        const { email, password } = req.body
        const lecturer = await lecturerModel.findOne({ email })

        if (!lecturer) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, lecturer.password)

        if (isMatch) {
            const token = jwt.sign({ id: lecturer._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get lecturer appointments for lecturer panel
const appointmentsLecturer = async (req, res) => {
    try {

        const { lecturerId } = req.body
        const appointments = await appointmentModel.find({ lecturerId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment from lecturer panel
const appointmentCancel = async (req, res) => {
    try {

        const { lecturerId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.lecturerId === lecturerId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: 'Appointment Cancelled' })
        }

        res.json({ success: false, message: 'Unauthorized action' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to mark appointment completed from lecturer panel
const appointmentComplete = async (req, res) => {
    try {

        const { lecturerId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.lecturerId === lecturerId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: 'Appointment Completed' })
        }

        res.json({ success: false, message: 'Unauthorized action' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get all lecturers list for frontend (for students to choose from)
const lecturerList = async (req, res) => {
    try {

        const lecturers = await lecturerModel.find({}).select(['-password', '-email'])
        res.json({ success: true, lecturers })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to change lecturer availability for lecturer panel
const changeAvailablity = async (req, res) => {
    try {

        const { lecturerId } = req.body

        const lecturerData = await lecturerModel.findById(lecturerId)
        await lecturerModel.findByIdAndUpdate(lecturerId, { available: !lecturerData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get lecturer profile for lecturer panel
const lecturerProfile = async (req, res) => {
    try {

        const { lecturerId } = req.body
        const profileData = await lecturerModel.findById(lecturerId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update lecturer profile data from lecturer panel
const updateLecturerProfile = async (req, res) => {
    try {

        const { lecturerId, address, available } = req.body

        await lecturerModel.findByIdAndUpdate(lecturerId, { address, available })

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for lecturer panel
const lecturerDashboard = async (req, res) => {
    try {

        const { lecturerId } = req.body

        const appointments = await appointmentModel.find({ lecturerId })

        let students = []

        appointments.map((item) => {
            if (!students.includes(item.studentId)) {
                students.push(item.studentId)
            }
        })

        const dashData = {
            appointments: appointments.length,
            students: students.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    registerLecturer,
    loginLecturer,
    appointmentsLecturer,
    appointmentCancel,
    lecturerList,
    changeAvailablity,
    appointmentComplete,
    lecturerDashboard,
    lecturerProfile,
    updateLecturerProfile
}