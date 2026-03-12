# Postman Test Collection for UniConsult API

## Base URL
```
http://localhost:3000
```

## Test Flow

### 1. Register a Student
**POST** `/api/auth/register`

**Headers:**
```json
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "John Student",
  "email": "john.student@example.com",
  "password": "password123",
  "role": "STUDENT"
}
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. Register a Lecturer
**POST** `/api/auth/register`

**Headers:**
```json
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Dr. Sarah Lecturer",
  "email": "sarah.lecturer@example.com",
  "password": "password123",
  "role": "LECTURER",
  "department": "Computer Science",
  "specialization": "Artificial Intelligence",
  "availability": [
    {
      "day": "Monday",
      "startTime": "10:00",
      "endTime": "15:00"
    },
    {
      "day": "Wednesday",
      "startTime": "09:00",
      "endTime": "12:00"
    }
  ]
}
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3. Login as Student
**POST** `/api/auth/login`

**Headers:**
```json
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "john.student@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "STUDENT"
}
```

**Action:** Copy the token for next requests

---

### 4. Login as Lecturer
**POST** `/api/auth/login`

**Headers:**
```json
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "sarah.lecturer@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "LECTURER"
}
```

**Action:** Copy the token for lecturer requests

---

### 5. Get Student Profile
**GET** `/api/student/get-profile`

**Headers:**
```json
Content-Type: application/json
token: <STUDENT_TOKEN_HERE>
```

**Expected Response:**
```json
{
  "success": true,
  "userData": {
    "_id": "...",
    "name": "John Student",
    "email": "john.student@example.com",
    "role": "STUDENT",
    "verified": true,
    "createdAt": "2026-03-07T...",
    "updatedAt": "2026-03-07T..."
  }
}
```

---

### 6. Get All Lecturers (No Auth Required)
**GET** `/api/lecturer/list`

**Headers:**
```json
Content-Type: application/json
```

**Expected Response:**
```json
{
  "success": true,
  "lecturers": [
    {
      "_id": "...",
      "userId": {
        "_id": "...",
        "name": "Dr. Sarah Lecturer",
        "email": "sarah.lecturer@example.com"
      },
      "department": "Computer Science",
      "specialization": "Artificial Intelligence",
      "availability": [...]
    }
  ]
}
```

**Action:** Copy a lecturer's userId for booking appointment

---

### 7. Book Appointment (Student)
**POST** `/api/student/book-appointment`

**Headers:**
```json
Content-Type: application/json
token: <STUDENT_TOKEN_HERE>
```

**Body (raw JSON):**
```json
{
  "lecturerId": "<LECTURER_USER_ID_FROM_STEP_6>",
  "date": "2026-03-10T10:30:00Z",
  "topic": "Project Consultation - AI Implementation"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Appointment request sent"
}
```

---

### 8. Get Student Appointments
**GET** `/api/student/appointments`

**Headers:**
```json
Content-Type: application/json
token: <STUDENT_TOKEN_HERE>
```

**Expected Response:**
```json
{
  "success": true,
  "appointments": [
    {
      "_id": "...",
      "studentId": "...",
      "lecturerId": {
        "_id": "...",
        "name": "Dr. Sarah Lecturer",
        "email": "sarah.lecturer@example.com"
      },
      "date": "2026-03-10T10:30:00.000Z",
      "topic": "Project Consultation - AI Implementation",
      "status": "PENDING",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

**Action:** Copy appointment _id for next steps

---

### 9. Get Lecturer Appointments
**GET** `/api/lecturer/appointments`

**Headers:**
```json
Content-Type: application/json
token: <LECTURER_TOKEN_HERE>
```

**Expected Response:**
```json
{
  "success": true,
  "appointments": [
    {
      "_id": "...",
      "studentId": {
        "_id": "...",
        "name": "John Student",
        "email": "john.student@example.com"
      },
      "lecturerId": "...",
      "date": "2026-03-10T10:30:00.000Z",
      "topic": "Project Consultation - AI Implementation",
      "status": "PENDING",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### 10. Approve Appointment (Lecturer)
**POST** `/api/lecturer/approve-appointment`

**Headers:**
```json
Content-Type: application/json
token: <LECTURER_TOKEN_HERE>
```

**Body (raw JSON):**
```json
{
  "appointmentId": "<APPOINTMENT_ID_FROM_STEP_8>"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Appointment Approved"
}
```

---

### 11. Get Notifications (Student)
**GET** `/api/notifications/`

**Headers:**
```json
Content-Type: application/json
token: <STUDENT_TOKEN_HERE>
```

**Expected Response:**
```json
{
  "success": true,
  "notifications": [
    {
      "_id": "...",
      "userId": "...",
      "type": "appointment_approved",
      "message": "Your appointment has been approved",
      "status": "UNREAD",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### 12. Get Student Schedule
**GET** `/api/schedule/student`

**Headers:**
```json
Content-Type: application/json
token: <STUDENT_TOKEN_HERE>
```

**Expected Response:**
```json
{
  "success": true,
  "schedule": [
    {
      "_id": "...",
      "lecturerId": {
        "_id": "...",
        "name": "Dr. Sarah Lecturer",
        "email": "sarah.lecturer@example.com"
      },
      "date": "2026-03-10T10:30:00.000Z",
      "topic": "Project Consultation - AI Implementation",
      "status": "APPROVED"
    }
  ]
}
```

---

### 13. Get Student Dashboard
**GET** `/api/dashboard/student`

**Headers:**
```json
Content-Type: application/json
token: <STUDENT_TOKEN_HERE>
```

**Expected Response:**
```json
{
  "success": true,
  "dashData": {
    "totalAppointments": 1,
    "pendingAppointments": 0,
    "approvedAppointments": 1,
    "declinedAppointments": 0,
    "latestAppointments": [...]
  }
}
```

---

### 14. Get Lecturer Dashboard
**GET** `/api/dashboard/lecturer`

**Headers:**
```json
Content-Type: application/json
token: <LECTURER_TOKEN_HERE>
```

**Expected Response:**
```json
{
  "success": true,
  "dashData": {
    "totalAppointments": 1,
    "pendingRequests": 0,
    "approvedAppointments": 1,
    "todayConsultations": 0,
    "latestAppointments": [...]
  }
}
```

---

### 15. Update Student Profile
**POST** `/api/student/update-profile`

**Headers:**
```json
Content-Type: application/json
token: <STUDENT_TOKEN_HERE>
```

**Body (raw JSON):**
```json
{
  "name": "John Student Updated"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Profile Updated"
}
```

---

### 16. Update Lecturer Profile
**POST** `/api/lecturer/update-profile`

**Headers:**
```json
Content-Type: application/json
token: <LECTURER_TOKEN_HERE>
```

**Body (raw JSON):**
```json
{
  "name": "Dr. Sarah Lecturer Updated",
  "department": "Computer Science & Engineering",
  "specialization": "Machine Learning & AI",
  "availability": [
    {
      "day": "Monday",
      "startTime": "09:00",
      "endTime": "16:00"
    },
    {
      "day": "Tuesday",
      "startTime": "10:00",
      "endTime": "14:00"
    }
  ]
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Profile Updated"
}
```

---

### 17. Decline Appointment (Lecturer)
**POST** `/api/lecturer/decline-appointment`

**Headers:**
```json
Content-Type: application/json
token: <LECTURER_TOKEN_HERE>
```

**Body (raw JSON):**
```json
{
  "appointmentId": "<APPOINTMENT_ID>"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Appointment Declined"
}
```

---

### 18. Cancel Appointment (Student)
**POST** `/api/student/cancel-appointment`

**Headers:**
```json
Content-Type: application/json
token: <STUDENT_TOKEN_HERE>
```

**Body (raw JSON):**
```json
{
  "appointmentId": "<APPOINTMENT_ID>"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Appointment Cancelled"
}
```

---

### 19. Get Lecturer Profile
**GET** `/api/lecturer/profile`

**Headers:**
```json
Content-Type: application/json
token: <LECTURER_TOKEN_HERE>
```

**Expected Response:**
```json
{
  "success": true,
  "userData": {
    "_id": "...",
    "name": "Dr. Sarah Lecturer",
    "email": "sarah.lecturer@example.com",
    "role": "LECTURER",
    "verified": true
  },
  "lecturerInfo": {
    "_id": "...",
    "userId": "...",
    "department": "Computer Science",
    "specialization": "Artificial Intelligence",
    "availability": [...]
  }
}
```

---

### 20. Verify Email
**POST** `/api/auth/verify-email`

**Headers:**
```json
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "token": "verification_token_from_email"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Email verified successfully! You can now use all features."
}
```

---

### 21. Resend Verification Email
**POST** `/api/auth/resend-verification`

**Headers:**
```json
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "john.student@example.com"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Verification email sent! Please check your inbox."
}
```

---

### 22. Forgot Password
**POST** `/api/auth/forgot-password`

**Headers:**
```json
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "john.student@example.com"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Password reset link sent to email"
}
```

---

## Quick Test Sequence

1. Register Student → Save token as `{{student_token}}` → Check email
2. Verify Email → Use token from email
3. Register Lecturer → Save token as `{{lecturer_token}}` → Check email
4. Verify Email → Use token from email
5. Get Lecturers List → Copy lecturer userId
6. Book Appointment (use student token)
7. Get Lecturer Appointments (use lecturer token)
8. Approve Appointment (use lecturer token)
9. Get Student Notifications (use student token)
10. Get Student Schedule (use student token)
11. Get Dashboards for both roles
12. Test Forgot Password → Check email
13. Reset Password → Use token from email

## Environment Variables in Postman

Create these variables in Postman:
- `base_url`: `http://localhost:3000`
- `student_token`: (paste after login)
- `lecturer_token`: (paste after login)
- `lecturer_id`: (paste from lecturer list)
- `appointment_id`: (paste from appointments)

Then use them like:
- URL: `{{base_url}}/api/auth/login`
- Header: `token: {{student_token}}`
