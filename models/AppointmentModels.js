import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    lecturerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    date: { type: Date, required: true },
    topic: { type: String, default: "" },
    meetingType: { type: String, enum: ['online', 'in-person'], default: 'in-person' },
    zoomLink: { type: String, default: "" },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'DECLINED'], default: 'PENDING' },
}, { timestamps: true });

const appointmentModel = mongoose.models.appointment || mongoose.model("appointment", appointmentSchema);
export default appointmentModel;