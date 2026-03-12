import appointmentModel from "../models/AppointmentModels.js";

// API to get student dashboard data
const getStudentDashboard = async (req, res) => {
    try {
        const { userId } = req.body;

        const appointments = await appointmentModel.find({ studentId: userId });

        const pendingCount = appointments.filter(a => a.status === 'PENDING').length;
        const approvedCount = appointments.filter(a => a.status === 'APPROVED').length;
        const declinedCount = appointments.filter(a => a.status === 'DECLINED').length;

        const dashData = {
            totalAppointments: appointments.length,
            pendingAppointments: pendingCount,
            approvedAppointments: approvedCount,
            declinedAppointments: declinedCount,
            latestAppointments: appointments.slice(0, 5)
        };

        res.json({ success: true, dashData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get lecturer dashboard data
const getLecturerDashboard = async (req, res) => {
    try {
        const { userId } = req.body;

        const appointments = await appointmentModel.find({ lecturerId: userId });

        const pendingCount = appointments.filter(a => a.status === 'PENDING').length;
        const approvedCount = appointments.filter(a => a.status === 'APPROVED').length;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayAppointments = appointments.filter(a => {
            const appDate = new Date(a.date);
            appDate.setHours(0, 0, 0, 0);
            return appDate.getTime() === today.getTime() && a.status === 'APPROVED';
        });

        const dashData = {
            totalAppointments: appointments.length,
            pendingRequests: pendingCount,
            approvedAppointments: approvedCount,
            todayConsultations: todayAppointments.length,
            latestAppointments: appointments.slice(0, 5)
        };

        res.json({ success: true, dashData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { getStudentDashboard, getLecturerDashboard };
