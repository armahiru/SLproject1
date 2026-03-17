import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    department: { type: String, default: "" },
    phone: { type: String, default: "" },
    studentId: { type: String, default: "" },
}, { timestamps: true });

const studentModel = mongoose.models.student || mongoose.model("student", studentSchema);
export default studentModel;
