# Email Verification - Quick Reference Card

## 🔧 Setup (One Time)

```bash
# 1. Get Gmail App Password
https://myaccount.google.com/security → 2FA → App Passwords

# 2. Update .env
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx

# 3. Test
npm run test-email
```

## 📡 New Endpoints

| Endpoint | Body | Response |
|----------|------|----------|
| `POST /api/auth/register` | `{name, email, password, role}` | Sends verification email |
| `POST /api/auth/verify-email` | `{token}` | Marks email as verified |
| `POST /api/auth/resend-verification` | `{email}` | Resends verification email |
| `POST /api/auth/forgot-password` | `{email}` | Sends reset email |
| `POST /api/auth/reset-password` | `{token, newPassword}` | Resets password |

## 🎯 Quick Test

```bash
# 1. Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@gmail.com","password":"password123","role":"STUDENT"}'

# 2. Check email → Copy token from URL

# 3. Verify
curl -X POST http://localhost:3000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token":"TOKEN_FROM_EMAIL"}'
```

## 📧 Email Details

| Type | Expiry | Color | Subject |
|------|--------|-------|---------|
| Verification | 24 hours | Blue | "Verify Your Email - UniConsult" |
| Password Reset | 1 hour | Red | "Password Reset Request - UniConsult" |

## 🔐 Token Fields (User Model)

```javascript
verificationToken: String
verificationTokenExpiry: Date
resetPasswordToken: String
resetPasswordExpiry: Date
```

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Email not sending | Use app password, not regular password |
| Email in spam | Normal for dev, add to contacts |
| Token expired | Verification: 24h, Reset: 1h, use resend |
| 2FA required | Enable at myaccount.google.com/security |

## 📝 .env Template

```env
# Email (Required)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=consultation_system

# Auth
JWT_SECRET=your_jwt_secret
PORT=3000
```

## 🧪 Test Command

```bash
npm run test-email
```

## 📚 Full Docs

- `EMAIL_SETUP_GUIDE.md` - Complete guide
- `QUICK_EMAIL_SETUP.md` - 5-min setup
- `EMAIL_VERIFICATION_SUMMARY.md` - Implementation details
- `POSTMAN_TEST_COLLECTION.md` - API tests

## 🎉 Success Indicators

✅ `npm run test-email` sends 2 emails
✅ Registration returns `emailSent: true`
✅ Verification email arrives within seconds
✅ Token verification works
✅ Password reset email arrives

---

**Need help?** See `EMAIL_SETUP_GUIDE.md` for detailed instructions.
