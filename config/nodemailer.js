import nodemailer from "nodemailer";

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Send verification email
export const sendVerificationEmail = async (email, verificationToken, name) => {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
        from: `"UniConsult" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email - UniConsult',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
                    .button { display: inline-block; padding: 12px 30px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to UniConsult!</h1>
                    </div>
                    <div class="content">
                        <h2>Hi ${name},</h2>
                        <p>Thank you for registering with UniConsult. Please verify your email address to complete your registration.</p>
                        <p>Click the button below to verify your email:</p>
                        <a href="${verificationUrl}" class="button">Verify Email</a>
                        <p>Or copy and paste this link in your browser:</p>
                        <p style="word-break: break-all; color: #4F46E5;">${verificationUrl}</p>
                        <p><strong>This link will expire in 24 hours.</strong></p>
                        <p>If you didn't create an account, please ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2026 UniConsult. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Email sending error:', error);
        return { success: false, error: error.message };
    }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken, name) => {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
        from: `"UniConsult" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Reset Request - UniConsult',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #EF4444; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
                    .button { display: inline-block; padding: 12px 30px; background: #EF4444; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Password Reset Request</h1>
                    </div>
                    <div class="content">
                        <h2>Hi ${name},</h2>
                        <p>We received a request to reset your password for your UniConsult account.</p>
                        <p>Click the button below to reset your password:</p>
                        <a href="${resetUrl}" class="button">Reset Password</a>
                        <p>Or copy and paste this link in your browser:</p>
                        <p style="word-break: break-all; color: #EF4444;">${resetUrl}</p>
                        <p><strong>This link will expire in 1 hour.</strong></p>
                        <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2026 UniConsult. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Email sending error:', error);
        return { success: false, error: error.message };
    }
};

export default transporter;

// Send password changed confirmation email
export const sendPasswordChangedEmail = async (email, name) => {
    const mailOptions = {
        from: `"UniConsult" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Changed Successfully - UniConsult',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #16A34A; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Password Changed</h1>
                    </div>
                    <div class="content">
                        <h2>Hi ${name},</h2>
                        <p>Your password has been changed successfully.</p>
                        <p>If you did not make this change, please contact support immediately or reset your password.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2026 UniConsult. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Email sending error:', error);
        return { success: false, error: error.message };
    }
};


// Send appointment approved email to student
export const sendAppointmentApprovedEmail = async (email, studentName, lecturerName, date, topic, meetingType) => {
    const formattedDate = new Date(date).toLocaleString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    const mailOptions = {
        from: `"UniConsult" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '✅ Appointment Approved - UniConsult',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #16A34A; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
                    .details { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0; }
                    .details p { margin: 8px 0; }
                    .label { font-weight: bold; color: #374151; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Appointment Approved ✅</h1>
                    </div>
                    <div class="content">
                        <h2>Hi ${studentName},</h2>
                        <p>Great news! Your appointment has been <strong>approved</strong>.</p>
                        <div class="details">
                            <p><span class="label">Lecturer:</span> ${lecturerName}</p>
                            <p><span class="label">Date & Time:</span> ${formattedDate}</p>
                            <p><span class="label">Topic:</span> ${topic || 'Not specified'}</p>
                            <p><span class="label">Meeting Type:</span> ${meetingType === 'online' ? '💻 Online' : '🏫 In-Person'}</p>
                        </div>
                        <p>Please make sure to be on time. You can view your appointment details in your dashboard.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2026 UniConsult. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Appointment approved email error:', error);
        return { success: false, error: error.message };
    }
};

// Send appointment declined email to student
export const sendAppointmentDeclinedEmail = async (email, studentName, lecturerName, date, topic) => {
    const formattedDate = new Date(date).toLocaleString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    const mailOptions = {
        from: `"UniConsult" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '❌ Appointment Declined - UniConsult',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #DC2626; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
                    .details { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0; }
                    .details p { margin: 8px 0; }
                    .label { font-weight: bold; color: #374151; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Appointment Declined</h1>
                    </div>
                    <div class="content">
                        <h2>Hi ${studentName},</h2>
                        <p>Unfortunately, your appointment request has been <strong>declined</strong>.</p>
                        <div class="details">
                            <p><span class="label">Lecturer:</span> ${lecturerName}</p>
                            <p><span class="label">Date & Time:</span> ${formattedDate}</p>
                            <p><span class="label">Topic:</span> ${topic || 'Not specified'}</p>
                        </div>
                        <p>You can try booking a different time slot or contact the lecturer for more information.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2026 UniConsult. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Appointment declined email error:', error);
        return { success: false, error: error.message };
    }
};

// Send new appointment request email to lecturer
export const sendNewAppointmentEmail = async (email, lecturerName, studentName, date, topic, meetingType) => {
    const formattedDate = new Date(date).toLocaleString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    const mailOptions = {
        from: `"UniConsult" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '📋 New Appointment Request - UniConsult',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #2563EB; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
                    .details { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0; }
                    .details p { margin: 8px 0; }
                    .label { font-weight: bold; color: #374151; }
                    .button { display: inline-block; padding: 12px 30px; background: #2563EB; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>New Appointment Request 📋</h1>
                    </div>
                    <div class="content">
                        <h2>Hi ${lecturerName},</h2>
                        <p>You have a new appointment request from a student.</p>
                        <div class="details">
                            <p><span class="label">Student:</span> ${studentName}</p>
                            <p><span class="label">Date & Time:</span> ${formattedDate}</p>
                            <p><span class="label">Topic:</span> ${topic || 'Not specified'}</p>
                            <p><span class="label">Meeting Type:</span> ${meetingType === 'online' ? '💻 Online' : '🏫 In-Person'}</p>
                        </div>
                        <p>Please log in to your dashboard to approve or decline this request.</p>
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/lecturer/appointments" class="button">View Requests</a>
                    </div>
                    <div class="footer">
                        <p>&copy; 2026 UniConsult. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('New appointment email error:', error);
        return { success: false, error: error.message };
    }
};

// Send appointment cancelled email to lecturer
export const sendAppointmentCancelledEmail = async (email, lecturerName, studentName, date, topic) => {
    const formattedDate = new Date(date).toLocaleString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    const mailOptions = {
        from: `"UniConsult" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🚫 Appointment Cancelled - UniConsult',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #D97706; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
                    .details { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0; }
                    .details p { margin: 8px 0; }
                    .label { font-weight: bold; color: #374151; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Appointment Cancelled</h1>
                    </div>
                    <div class="content">
                        <h2>Hi ${lecturerName},</h2>
                        <p>A student has <strong>cancelled</strong> their appointment.</p>
                        <div class="details">
                            <p><span class="label">Student:</span> ${studentName}</p>
                            <p><span class="label">Date & Time:</span> ${formattedDate}</p>
                            <p><span class="label">Topic:</span> ${topic || 'Not specified'}</p>
                        </div>
                    </div>
                    <div class="footer">
                        <p>&copy; 2026 UniConsult. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Appointment cancelled email error:', error);
        return { success: false, error: error.message };
    }
};

// Send zoom link added email to student
export const sendZoomLinkEmail = async (email, studentName, lecturerName, date, zoomLink) => {
    const formattedDate = new Date(date).toLocaleString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    const mailOptions = {
        from: `"UniConsult" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🔗 Zoom Link Added - UniConsult',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
                    .details { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0; }
                    .details p { margin: 8px 0; }
                    .label { font-weight: bold; color: #374151; }
                    .button { display: inline-block; padding: 12px 30px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Zoom Link Added 🔗</h1>
                    </div>
                    <div class="content">
                        <h2>Hi ${studentName},</h2>
                        <p>A Zoom meeting link has been added to your upcoming appointment.</p>
                        <div class="details">
                            <p><span class="label">Lecturer:</span> ${lecturerName}</p>
                            <p><span class="label">Date & Time:</span> ${formattedDate}</p>
                        </div>
                        <p>Join the meeting using the link below:</p>
                        <a href="${zoomLink}" class="button">Join Zoom Meeting</a>
                        <p style="word-break: break-all; color: #4F46E5; font-size: 14px;">${zoomLink}</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2026 UniConsult. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Zoom link email error:', error);
        return { success: false, error: error.message };
    }
};
