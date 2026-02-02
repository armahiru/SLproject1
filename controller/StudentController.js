import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import studentModel from "../models/StudentModels.js";
import lecturerModel from "../models/LecturerModels.js";
import appointmentModel from "../models/AppointmentModels.js";
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

// API to register student
const registerStudent = async (req, res) => {

    try {
        if (!ensureDbConnected(res)) return;
        const { name, email, password } = req.body;

        // checking for all data to register student
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing student password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        const studentData = {
            name,
            email,
            password: hashedPassword,
        }

        const newStudent = new studentModel(studentData)
        const student = await newStudent.save()
        const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to login student
const loginStudent = async (req, res) => {

    try {
        if (!ensureDbConnected(res)) return;
        const { email, password } = req.body;
        const student = await studentModel.findOne({ email })

        if (!student) {
            return res.json({ success: false, message: "Student does not exist" })
        }

        const isMatch = await bcrypt.compare(password, student.password)

        if (isMatch) {
            const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get student profile data
const getProfile = async (req, res) => {

    try {
        const { studentId } = req.body
        const studentData = await studentModel.findById(studentId).select('-password')

        res.json({ success: true, studentData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update student profile (no image upload)
const updateProfile = async (req, res) => {

    try {

        const { studentId, name, phone, address, dob, gender } = req.body;

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        await studentModel.findByIdAndUpdate(studentId, {
            name,
            phone,
            address: JSON.parse(address),
            dob,
            gender,
        });

        res.json({ success: true, message: "Profile Updated" });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for student to book consultation appointment with lecturer
const bookAppointment = async (req, res) => {

    try {

        const { studentId, lecturerId, slotDate, slotTime } = req.body;
        const lecturerData = await lecturerModel.findById(lecturerId).select("-password");

        if (!lecturerData.available) {
            return res.json({ success: false, message: "Lecturer Not Available" });
        }

        let slots_booked = lecturerData.slots_booked;

        // checking for slot availablity 
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: "Slot Not Available" });
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [];
            slots_booked[slotDate].push(slotTime);
        }

        const studentData = await studentModel.findById(studentId).select("-password");

        delete lecturerData.slots_booked;

        const appointmentData = {
            studentId,
            lecturerId,
            studentData,
            lecturerData,
            slotTime,
            slotDate,
            date: Date.now(),
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        // save new slots data in lecturer data
        await lecturerModel.findByIdAndUpdate(lecturerId, { slots_booked });

        res.json({ success: true, message: "Consultation Appointment Booked" });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {

        const { studentId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment student 
        if (appointmentData.studentId !== studentId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing lecturer slot 
        const { lecturerId, slotDate, slotTime } = appointmentData

        const lecturerData = await lecturerModel.findById(lecturerId)

        let slots_booked = lecturerData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await lecturerModel.findByIdAndUpdate(lecturerId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get student appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {

        const { studentId } = req.body
        const appointments = await appointmentModel.find({ studentId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginStudent,
    registerStudent,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment
}