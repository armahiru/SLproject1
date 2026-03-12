# Migration Guide

## Overview
This guide helps you migrate from the old schema to the new MongoDB-compliant structure.

## Key Changes

### 1. Unified User Collection
**Before:** Separate `students` and `lecturers` collections with full user data
**After:** Single `users` collection with role field, separate `lecturers` collection for extra info

### 2. Authentication Changes
**Before:** 
- `/api/student/register` and `/api/student/login`
- `/api/lecturer/register` and `/api/lecturer/login`

**After:**
- `/api/auth/register` (with role: 'STUDENT' or 'LECTURER')
- `/api/auth/login` (returns role in response)

### 3. Appointment Status
**Before:** `cancelled: Boolean`, `isCompleted: Boolean`
**After:** `status: Enum ['PENDING', 'APPROVED', 'DECLINED']`

### 4. Appointment Data
**Before:** Stored full `studentData` and `lecturerData` objects, `slotDate`, `slotTime`
**After:** References via `studentId` and `lecturerId`, single `date` field

### 5. Middleware Changes
**Before:** `AuthStudent` sets `studentId`, `AuthLecturer` sets `lecturerId`
**After:** Unified `authMiddleware` sets `userId` and `userRole`

### 6. New Features
- Notifications system
- Unified schedule endpoints
- Dashboard endpoints for both roles
- Password reset functionality (placeholder)

## API Endpoint Changes

### Registration
```javascript
// OLD
POST /api/student/register
{ name, email, password }

// NEW
POST /api/auth/register
{ name, email, password, role: "STUDENT" }
```

### Login
```javascript
// OLD
POST /api/student/login
{ email, password }

// NEW
POST /api/auth/login
{ email, password }
// Returns: { success, token, role }
```

### Book Appointment
```javascript
// OLD
POST /api/student/book-appointment
{ studentId, lecturerId, slotDate, slotTime }

// NEW
POST /api/student/book-appointment
{ lecturerId, date: "2026-03-10T10:30:00Z", topic: "..." }
// studentId comes from auth token
```

### Lecturer Actions
```javascript
// OLD
POST /api/lecturer/cancel-appointment
POST /api/lecturer/complete-appointment

// NEW
POST /api/lecturer/approve-appointment
POST /api/lecturer/decline-appointment
```

## Database Migration Steps

### Step 1: Backup Current Data
```bash
mongodump --db your_database --out backup/
```

### Step 2: Create New Collections
The new models will automatically create collections on first use.

### Step 3: Migrate Users
```javascript
// Migrate students to users
db.students.find().forEach(student => {
  db.users.insertOne({
    name: student.name,
    email: student.email,
    password: student.password,
    role: "STUDENT",
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });
});

// Migrate lecturers to users and lecturers
db.lecturers.find().forEach(lecturer => {
  const user = db.users.insertOne({
    name: lecturer.name,
    email: lecturer.email,
    password: lecturer.password,
    role: "LECTURER",
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  db.lecturers.insertOne({
    userId: user.insertedId,
    department: lecturer.degree || "",
    specialization: lecturer.speciality || "",
    availability: [],
    slots_booked: lecturer.slots_booked || {}
  });
});
```

### Step 4: Migrate Appointments
```javascript
db.appointments.find().forEach(apt => {
  const student = db.users.findOne({ email: apt.studentData.email });
  const lecturer = db.users.findOne({ email: apt.lecturerData.email });
  
  let status = "PENDING";
  if (apt.cancelled) status = "DECLINED";
  else if (apt.isCompleted) status = "APPROVED";
  
  db.appointments.updateOne(
    { _id: apt._id },
    {
      $set: {
        studentId: student._id,
        lecturerId: lecturer._id,
        date: new Date(apt.slotDate + " " + apt.slotTime),
        topic: "",
        status: status
      },
      $unset: {
        studentData: "",
        lecturerData: "",
        slotDate: "",
        slotTime: "",
        cancelled: "",
        isCompleted: ""
      }
    }
  );
});
```

## Frontend Changes Required

### 1. Update Registration Forms
Add role selection (STUDENT or LECTURER)

### 2. Update API Calls
Change endpoints from `/api/student/login` to `/api/auth/login`

### 3. Update Token Storage
Store role along with token for role-based UI rendering

### 4. Update Appointment Display
Use `status` field instead of `cancelled` and `isCompleted`

### 5. Add Notifications UI
Implement notification display using `/api/notifications`

## Testing Checklist
- [ ] Student registration works
- [ ] Lecturer registration works
- [ ] Login returns correct role
- [ ] Student can book appointments
- [ ] Lecturer can approve/decline appointments
- [ ] Notifications are created
- [ ] Schedule endpoints work
- [ ] Dashboard shows correct data
- [ ] Profile updates work for both roles
