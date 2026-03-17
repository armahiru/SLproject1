import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import crypto from "crypto";
import userModel from "../models/UserModels.js";
import lecturerModel from "../models/LecturerModels.js";
import studentModel from "../models/StudentModels.js";
import { sendVerificationEmail, sendPasswordResetEmail, sendPasswordChangedEmail } from "../config/nodemailer.js";
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

// API to register user (student or lecturer)
const register = async (req, res) => {
    try {
        if (!ensureDbConnected(res)) return;
        
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        if (!['STUDENT', 'LECTURER'].includes(role)) {
            return res.json({ success: false, message: 'Invalid role. Use STUDENT or LECTURER' });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            role,
            verified: false,
            verificationToken,
            verificationTokenExpiry
        });

        const user = await newUser.save();

        // If lecturer, create lecturer info document
        if (role === 'LECTURER') {
            const lecturerInfo = new lecturerModel({
                userId: user._id,
                department: req.body.department || "",
                specialization: req.body.specialization || "",
                availability: req.body.availability || []
            });
            await lecturerInfo.save();
        }

        // If student, create student info document
        if (role === 'STUDENT') {
            const studentInfo = new studentModel({
                userId: user._id,
                department: "",
                phone: "",
                studentId: ""
            });
            await studentInfo.save();
        }

        // Send verification email in the background (don't block the response)
        sendVerificationEmail(email, verificationToken, name).catch(err => {
            console.error('Failed to send verification email:', err);
        });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.json({ 
            success: true, 
            token,
            message: 'Registration successful! Please check your email to verify your account.',
            emailSent: true
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to login user
const login = async (req, res) => {
    try {
        if (!ensureDbConnected(res)) return;
        
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
            res.json({ success: true, token, role: user.role, name: user.name });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API for forgot password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.json({ success: false, message: "Email is required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiry = resetPasswordExpiry;
        await user.save();

        // Send password reset email
        const emailResult = await sendPasswordResetEmail(email, resetToken, user.name);

        if (!emailResult.success) {
            return res.json({ 
                success: false, 
                message: "Failed to send reset email. Please try again." 
            });
        }

        res.json({ 
            success: true, 
            message: "Password reset link sent to your email" 
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API for reset password
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.json({ success: false, message: "Token and new password are required" });
        }

        if (newPassword.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password (min 8 characters)" });
        }

        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.json({ success: false, message: "Invalid or expired reset token" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        await user.save();

        res.json({ success: true, message: "Password reset successful. You can now login." });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to verify email
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.json({ success: false, message: "Verification token is required" });
        }

        const user = await userModel.findOne({
            verificationToken: token,
            verificationTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.json({ success: false, message: "Invalid or expired verification token" });
        }

        user.verified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();

        res.json({ 
            success: true, 
            message: "Email verified successfully! You can now use all features." 
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to resend verification email
const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({ success: false, message: "Email is required" });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.verified) {
            return res.json({ success: false, message: "Email is already verified" });
        }

        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        user.verificationToken = verificationToken;
        user.verificationTokenExpiry = verificationTokenExpiry;
        await user.save();

        // Send verification email
        const emailResult = await sendVerificationEmail(email, verificationToken, user.name);

        if (!emailResult.success) {
            return res.json({ 
                success: false, 
                message: "Failed to send verification email. Please try again." 
            });
        }

        res.json({ 
            success: true, 
            message: "Verification email sent! Please check your inbox." 
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// API to change password (authenticated)
const changePassword = async (req, res) => {
    try {
        if (!ensureDbConnected(res)) return;

        const { userId, currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.json({ success: false, message: "Current and new password are required" });
        }

        if (newPassword.length < 8) {
            return res.json({ success: false, message: "New password must be at least 8 characters" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Current password is incorrect" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        // Send confirmation email in the background (don't block the response)
        sendPasswordChangedEmail(user.email, user.name).catch(err => {
            console.error('Failed to send password changed email:', err);
        });

        res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { register, login, forgotPassword, resetPassword, verifyEmail, resendVerification, changePassword };
