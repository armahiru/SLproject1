import mongoose from "mongoose";

const lecturerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    department: { type: String, default: "" },
    specialization: { type: String, default: "" },
    availability: [{
        day: { type: String },
        startTime: { type: String },
        endTime: { type: String }
    }],
    slots_booked: { type: Object, default: {} },
}, { minimize: false });

const lecturerModel = mongoose.models.lecturer || mongoose.model("lecturer", lecturerSchema);
export default lecturerModel;