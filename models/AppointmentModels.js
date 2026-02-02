import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    lecturerId: { type: String, required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    studentData: { type: Object, required: true },
    lecturerData: { type: Object, required: true },
    date: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false }
})

const appointmentModel = mongoose.models.appointment || mongoose.model("appointment", appointmentSchema)
export default appointmentModel