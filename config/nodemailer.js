// Email service using Brevo (Sendinblue) HTTP API
// No SMTP needed - works on Render free tier
// Free: 300 emails/day, no domain verification required

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'uniconsult2@gmail.com';
const SENDER_NAME = process.env.SENDER_NAME || 'UniConsult';

const sendEmail = async (to, subject, html) => {
    if (!BREVO_API_KEY) {
        console.error('❌ BREVO_API_KEY not set');
        return { success: false, error: 'Email API key not configured' };
    }
    try {
        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: SENDER_NAME, email: SENDER_EMAIL },
                to: [{ email: to }],
                subject,
                htmlContent: html
            })
        });
        const data = await res.json();
        if (res.ok) {
            console.log('✅ Email sent to:', to, '| messageId:', data.messageId);
            return { success: true };
        }
        console.error('❌ Brevo error:', data);
        return { success: false, error: data.message || 'Email send failed' };
    } catch (err) {
        console.error('❌ Email error:', err.message);
        return { success: false, error: err.message };
    }
};

// Shared email template
const emailWrapper = (headerBg, headerTitle, bodyContent) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: ${headerBg}; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
        .button { display: inline-block; padding: 12px 30px; background: ${headerBg}; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .details { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0; }
        .details p { margin: 8px 0; }
        .label { font-weight: bold; color: #374151; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header"><h1>${headerTitle}</h1></div>
        <div class="content">${bodyContent}</div>
        <div class="footer"><p>&copy; 2026 UniConsult. All rights reserved.</p></div>
    </div>
</body>
</html>`;

const frontendUrl = () => process.env.FRONTEND_URL || 'http://localhost:5173';

const formatDate = (date) => new Date(date).toLocaleString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
});

// ===== AUTH EMAILS =====

export const sendVerificationEmail = async (email, verificationToken, name) => {
    const url = `${frontendUrl()}/verify-email?token=${verificationToken}`;
    return sendEmail(email, 'Verify Your Email - UniConsult', emailWrapper('#4F46E5', 'Welcome to UniConsult!', `
        <h2>Hi ${name},</h2>
        <p>Thank you for registering. Please verify your email address.</p>
        <a href="${url}" class="button">Verify Email</a>
        <p>Or copy this link: <span style="word-break:break-all;color:#4F46E5;">${url}</span></p>
        <p><strong>This link expires in 24 hours.</strong></p>
    `));
};

export const sendPasswordResetEmail = async (email, resetToken, name) => {
    const url = `${frontendUrl()}/reset-password?token=${resetToken}`;
    return sendEmail(email, 'Password Reset - UniConsult', emailWrapper('#EF4444', 'Password Reset Request', `
        <h2>Hi ${name},</h2>
        <p>We received a request to reset your password.</p>
        <a href="${url}" class="button">Reset Password</a>
        <p>Or copy this link: <span style="word-break:break-all;color:#EF4444;">${url}</span></p>
        <p><strong>This link expires in 1 hour.</strong></p>
        <p>If you didn't request this, ignore this email.</p>
    `));
};

export const sendPasswordChangedEmail = async (email, name) => {
    return sendEmail(email, 'Password Changed - UniConsult', emailWrapper('#16A34A', 'Password Changed', `
        <h2>Hi ${name},</h2>
        <p>Your password has been changed successfully.</p>
        <p>If you did not make this change, please reset your password immediately.</p>
    `));
};

// ===== APPOINTMENT EMAILS =====

export const sendAppointmentApprovedEmail = async (email, studentName, lecturerName, date, topic, meetingType) => {
    return sendEmail(email, 'Appointment Approved - UniConsult', emailWrapper('#16A34A', 'Appointment Approved ✅', `
        <h2>Hi ${studentName},</h2>
        <p>Great news! Your appointment has been <strong>approved</strong>.</p>
        <div class="details">
            <p><span class="label">Lecturer:</span> ${lecturerName}</p>
            <p><span class="label">Date & Time:</span> ${formatDate(date)}</p>
            <p><span class="label">Topic:</span> ${topic || 'Not specified'}</p>
            <p><span class="label">Meeting Type:</span> ${meetingType === 'online' ? 'Online' : 'In-Person'}</p>
        </div>
        <p>Please make sure to be on time.</p>
    `));
};

export const sendAppointmentDeclinedEmail = async (email, studentName, lecturerName, date, topic) => {
    return sendEmail(email, 'Appointment Declined - UniConsult', emailWrapper('#DC2626', 'Appointment Declined', `
        <h2>Hi ${studentName},</h2>
        <p>Unfortunately, your appointment has been <strong>declined</strong>.</p>
        <div class="details">
            <p><span class="label">Lecturer:</span> ${lecturerName}</p>
            <p><span class="label">Date & Time:</span> ${formatDate(date)}</p>
            <p><span class="label">Topic:</span> ${topic || 'Not specified'}</p>
        </div>
        <p>You can try booking a different time slot.</p>
    `));
};

export const sendNewAppointmentEmail = async (email, lecturerName, studentName, date, topic, meetingType) => {
    return sendEmail(email, 'New Appointment Request - UniConsult', emailWrapper('#2563EB', 'New Appointment Request', `
        <h2>Hi ${lecturerName},</h2>
        <p>You have a new appointment request.</p>
        <div class="details">
            <p><span class="label">Student:</span> ${studentName}</p>
            <p><span class="label">Date & Time:</span> ${formatDate(date)}</p>
            <p><span class="label">Topic:</span> ${topic || 'Not specified'}</p>
            <p><span class="label">Meeting Type:</span> ${meetingType === 'online' ? 'Online' : 'In-Person'}</p>
        </div>
        <a href="${frontendUrl()}/lecturer/appointments" class="button">View Requests</a>
    `));
};

export const sendAppointmentCancelledEmail = async (email, lecturerName, studentName, date, topic) => {
    return sendEmail(email, 'Appointment Cancelled - UniConsult', emailWrapper('#D97706', 'Appointment Cancelled', `
        <h2>Hi ${lecturerName},</h2>
        <p>A student has <strong>cancelled</strong> their appointment.</p>
        <div class="details">
            <p><span class="label">Student:</span> ${studentName}</p>
            <p><span class="label">Date & Time:</span> ${formatDate(date)}</p>
            <p><span class="label">Topic:</span> ${topic || 'Not specified'}</p>
        </div>
    `));
};

export const sendZoomLinkEmail = async (email, studentName, lecturerName, date, zoomLink) => {
    return sendEmail(email, 'Zoom Link Added - UniConsult', emailWrapper('#4F46E5', 'Zoom Link Added', `
        <h2>Hi ${studentName},</h2>
        <p>A Zoom link has been added to your appointment.</p>
        <div class="details">
            <p><span class="label">Lecturer:</span> ${lecturerName}</p>
            <p><span class="label">Date & Time:</span> ${formatDate(date)}</p>
        </div>
        <a href="${zoomLink}" class="button">Join Zoom Meeting</a>
        <p style="word-break:break-all;color:#4F46E5;font-size:14px;">${zoomLink}</p>
    `));
};

export default { sendEmail };
