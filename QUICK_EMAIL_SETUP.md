# Quick Email Setup Checklist

## ✅ Step-by-Step Setup (5 minutes)

### 1. Get Gmail App Password
1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification" (if not already enabled)
3. Click "App passwords" under "Signing in to Google"
4. Select "Mail" and "Other (Custom name)"
5. Name it "UniConsult"
6. Click "Generate"
7. **Copy the 16-character password**

### 2. Update .env File
Open `backend/.env` and update these lines:

```env
EMAIL_USER=your_actual_email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

Replace:
- `your_actual_email@gmail.com` with your Gmail address
- `xxxx xxxx xxxx xxxx` with the app password from step 1

### 3. Test It!
Start your server:
```bash
cd backend
npm start
```

Register a new user:
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "your_test_email@gmail.com",
  "password": "password123",
  "role": "STUDENT"
}
```

**Check your email!** You should receive a verification email within seconds.

## 🎯 What You Get

### Registration Email
- ✅ Professional HTML template
- ✅ Verification button
- ✅ 24-hour expiry
- ✅ Fallback link

### Password Reset Email
- ✅ Security-focused design
- ✅ Reset button
- ✅ 1-hour expiry
- ✅ Warning message

## 🔧 New API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/register` | POST | Now sends verification email |
| `/api/auth/verify-email` | POST | Verify email with token |
| `/api/auth/resend-verification` | POST | Resend verification email |
| `/api/auth/forgot-password` | POST | Send password reset email |
| `/api/auth/reset-password` | POST | Reset password with token |

## 🚨 Common Issues

### Email not sending?
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- Make sure you're using app password, not regular password
- Verify 2FA is enabled on your Google account

### Email in spam?
- Add sender to contacts
- Mark as "Not Spam"
- This is normal for development

### Token expired?
- Verification tokens: 24 hours
- Reset tokens: 1 hour
- Use resend endpoint to get new token

## 📝 Example Flow

1. **User registers** → System sends verification email
2. **User clicks link** → Frontend extracts token from URL
3. **Frontend calls** `/api/auth/verify-email` with token
4. **Account verified** → User can access all features

## 🎨 Email Preview

### Verification Email
```
┌─────────────────────────────────┐
│   Welcome to UniConsult!        │
├─────────────────────────────────┤
│ Hi John,                        │
│                                 │
│ Thank you for registering...    │
│                                 │
│ [Verify Email Button]           │
│                                 │
│ Link expires in 24 hours        │
└─────────────────────────────────┘
```

### Password Reset Email
```
┌─────────────────────────────────┐
│   Password Reset Request        │
├─────────────────────────────────┤
│ Hi John,                        │
│                                 │
│ We received a request to...     │
│                                 │
│ [Reset Password Button]         │
│                                 │
│ Link expires in 1 hour          │
└─────────────────────────────────┘
```

## 🔐 Security Features

- ✅ Passwords hashed with bcrypt
- ✅ Tokens are cryptographically secure
- ✅ Tokens expire automatically
- ✅ Single-use tokens
- ✅ Email validation

## 📦 What Was Installed

```bash
npm install nodemailer
```

That's it! Just one package.

## 🚀 Ready to Test?

Use the Postman collection in `POSTMAN_TEST_COLLECTION.md` to test all endpoints!
