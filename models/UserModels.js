import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['STUDENT', 'LECTURER'], required: true },
    image: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpiry: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpiry: { type: Date },
}, { timestamps: true });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
