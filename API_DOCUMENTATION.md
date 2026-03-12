# UniConsult Backend API Documentation

## Overview
This backend follows the MongoDB requirements with unified user authentication, role-based access, and proper appointment management.

## Collections

### 1. users
Stores both students and lecturers
- `name`: String
- `email`: String (unique)
- `password`: String (hashed)
- `role`: Enum ['STUDENT', 'LECTURER']
- `verified`: Boolean
- `timestamps`: createdAt, updatedAt

### 2. lecturers
Stores lecturer-specific information
- `userId`: ObjectId (ref: user)
- `department`: String
- `specialization`: String
- `availability`: Array of {day, startTime, endTime}
- `slots_booked`: Object

### 3. appointments
Stores consultation bookings
- `studentId`: ObjectId (ref: user)
- `lecturerId`: ObjectId (ref: user)
- `date`: Date
- `topic`: String
- `status`: Enum ['PENDING', 'APPROVED', 'DECLINED']
- `timestamps`: createdAt, updatedAt

### 4. notifications
Stores user notifications
- `userId`: ObjectId (ref: user)
- `type`: String
- `message`: String
- `status`: Enum ['READ', 'UNREAD']
- `timestamps`: createdAt, updatedAt

## API Endpoints

### Authentication Module
**Base URL:** `/api/auth`

#### POST /register
Register a new user (student or lecturer) - Sends verification email
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "STUDENT",
  "department": "Computer Science",
  "specialization": "AI & ML"
}
```
**Response:**
```json
{
  "success": true,
  "token": "jwt_token",
  "message": "Registration successful! Please check your email to verify your account.",
  "emailSent": true
}
```

#### POST /login
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /verify-email
Verify email address with token from email
```json
{
  "token": "verification_token_from_email"
}
```

#### POST /resend-verification
Resend verification email
```json
{
  "email": "john@example.com"
}
```

#### POST /forgot-password
Request password reset - Sends reset email
```json
{
  "email": "john@example.com"
}
```

#### POST /reset-password
Reset password with token from email
```json
{
  "token": "reset_token_from_email",
  "newPassword": "newpassword123"
}
```

### Student Module
**Base URL:** `/api/student`
**Auth Required:** Yes (token in headers)

#### GET /get-profile
Get student profile

#### POST /update-profile
Update student profile
```json
{
  "name": "John Doe Updated"
}
```

#### POST /book-appointment
Book consultation appointment
```json
{
  "lecturerId": "lecturer_id",
  "date": "2026-03-10T10:30:00Z",
  "topic": "Project Consultation"
}
```

#### GET /appointments
Get all student appointments

#### POST /cancel-appointment
Cancel an appointment
```json
{
  "appointmentId": "appointment_id"
}
```

### Lecturer Module
**Base URL:** `/api/lecturer`

#### GET /list
Get all lecturers (no auth required)

**Auth Required for below endpoints:** Yes (token in headers)

#### GET /appointments
Get all lecturer appointments

#### POST /approve-appointment
Approve an appointment
```json
{
  "appointmentId": "appointment_id"
}
```

#### POST /decline-appointment
Decline an appointment
```json
{
  "appointmentId": "appointment_id"
}
```

#### GET /dashboard
Get lecturer dashboard data

#### GET /profile
Get lecturer profile

#### POST /update-profile
Update lecturer profile
```json
{
  "name": "Dr. Smith",
  "department": "Computer Science",
  "specialization": "Machine Learning",
  "availability": [
    { "day": "Monday", "startTime": "10:00", "endTime": "15:00" }
  ]
}
```

### Notifications Module
**Base URL:** `/api/notifications`
**Auth Required:** Yes (token in headers)

#### GET /
Get all user notifications

#### PUT /:id/read
Mark notification as read

### Schedule Module
**Base URL:** `/api/schedule`
**Auth Required:** Yes (token in headers)

#### GET /student
Get student schedule (approved appointments)

#### GET /lecturer
Get lecturer schedule (approved appointments)

### Dashboard Module
**Base URL:** `/api/dashboard`
**Auth Required:** Yes (token in headers)

#### GET /student
Get student dashboard data

#### GET /lecturer
Get lecturer dashboard data

## Authentication
All protected routes require a JWT token in the request headers:
```
headers: {
  "token": "your_jwt_token"
}
```

## Security Features
- Password hashing with bcrypt
- JWT authentication
- Role-based access control (STUDENT vs LECTURER)
- Input validation
- MongoDB injection prevention

## Status Codes
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 503: Service Unavailable (DB not connected)
