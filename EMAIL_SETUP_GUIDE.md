# Email Verification Setup Guide

## Overview
The backend now supports email verification for user registration and password reset functionality using Nodemailer.

## Features Implemented
1. ✅ Email verification on registration
2. ✅ Resend verification email
3. ✅ Password reset via email
4. ✅ Beautiful HTML email templates
5. ✅ Token expiry (24 hours for verification, 1 hour for password reset)

## Gmail Setup (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", enable "2-Step Verification"
4. Follow the prompts to set it up

### Step 2: Generate App Password
1. After enabling 2FA, go back to Security settings
2. Under "Signing in to Google", click "App passwords"
3. Select "Mail" as the app and "Other" as the device
4. Name it "UniConsult Backend" or similar
5. Click "Generate"
6. **Copy the 16-character password** (you won't see it again)

### Step 3: Update .env File
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # The 16-character app password
FRONTEND_URL=http://localhost:5173
```

## Alternative Email Services

### Using Outlook/Hotmail
```env
EMAIL_SERVICE=hotmail
EMAIL_USER=your_email@outlook.com
EMAIL_PASSWORD=your_password
```

### Using Yahoo
```env
EMAIL_SERVICE=yahoo
EMAIL_USER=your_email@yahoo.com
EMAIL_PASSWORD=your_app_password
```

### Using Custom SMTP
If you want to use a custom SMTP server, update `backend/config/nodemailer.js`:

```javascript
const transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
```

## New API Endpoints

### 1. Register (Updated)
**POST** `/api/auth/register`

Now sends verification email automatically.

**Response:**
```json
{
  "success": true,
  "token": "jwt_token",
  "message": "Registration successful! Please check your email to verify your account.",
  "emailSent": true
}
```

### 2. Verify Email
**POST** `/api/auth/verify-email`

**Body:**
```json
{
  "token": "verification_token_from_email"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully! You can now use all features."
}
```

### 3. Resend Verification Email
**POST** `/api/auth/resend-verification`

**Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification email sent! Please check your inbox."
}
```

### 4. Forgot Password (Updated)
**POST** `/api/auth/forgot-password`

Now actually sends reset email.

**Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

### 5. Reset Password (Updated)
**POST** `/api/auth/reset-password`

**Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful. You can now login."
}
```

## Email Templates

### Verification Email
- Professional design with UniConsult branding
- Clear call-to-action button
- Fallback link for manual copy-paste
- 24-hour expiry notice

### Password Reset Email
- Security-focused design
- Reset button with clear instructions
- 1-hour expiry notice
- Warning about unsolicited requests

## Testing Email Functionality

### Test 1: Registration with Email
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "role": "STUDENT"
}
```

Check your email inbox for verification email.

### Test 2: Verify Email
Copy the token from the email URL and:
```bash
POST http://localhost:3000/api/auth/verify-email
Content-Type: application/json

{
  "token": "token_from_email"
}
```

### Test 3: Resend Verification
```bash
POST http://localhost:3000/api/auth/resend-verification
Content-Type: application/json

{
  "email": "test@example.com"
}
```

### Test 4: Forgot Password
```bash
POST http://localhost:3000/api/auth/forgot-password
Content-Type: application/json

{
  "email": "test@example.com"
}
```

### Test 5: Reset Password
```bash
POST http://localhost:3000/api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "newPassword": "newpassword123"
}
```

## Troubleshooting

### Email Not Sending
1. **Check credentials**: Ensure EMAIL_USER and EMAIL_PASSWORD are correct
2. **App password**: For Gmail, use app password, not regular password
3. **2FA**: Gmail requires 2-factor authentication to generate app passwords
4. **Firewall**: Check if port 587 or 465 is blocked
5. **Logs**: Check console for error messages

### Email Goes to Spam
1. Add your email to contacts
2. Mark as "Not Spam"
3. For production, use a verified domain with SPF/DKIM records

### Token Expired
- Verification tokens expire after 24 hours
- Password reset tokens expire after 1 hour
- Use resend verification endpoint to get a new token

### Email Not Received
1. Check spam/junk folder
2. Verify email address is correct
3. Check email service status
4. Try resending verification email

## Security Best Practices

1. **Never commit .env file** - Already in .gitignore
2. **Use app passwords** - Don't use your main email password
3. **Rotate tokens** - Tokens are single-use and expire
4. **HTTPS in production** - Use secure connections for email links
5. **Rate limiting** - Consider adding rate limits to prevent abuse

## Production Considerations

### Use a Dedicated Email Service
For production, consider using:
- **SendGrid** - Free tier: 100 emails/day
- **Mailgun** - Free tier: 5,000 emails/month
- **AWS SES** - Very cheap, highly scalable
- **Postmark** - Excellent deliverability

### Example with SendGrid
```javascript
// Install: npm install @sendgrid/mail
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: email,
  from: 'noreply@uniconsult.com',
  subject: 'Verify Your Email',
  html: emailTemplate
};

await sgMail.send(msg);
```

## Frontend Integration

### Verification Flow
1. User registers → Receives email
2. User clicks link → Frontend extracts token from URL
3. Frontend calls `/api/auth/verify-email` with token
4. Show success message

### Example Frontend Code (React)
```javascript
// In your verify-email page
const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      fetch('http://localhost:3000/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Show success message
        }
      });
    }
  }, [token]);
};
```

## Database Schema Updates

The `users` collection now includes:
```javascript
{
  verificationToken: String,
  verificationTokenExpiry: Date,
  resetPasswordToken: String,
  resetPasswordExpiry: Date
}
```

These fields are automatically managed by the system.
