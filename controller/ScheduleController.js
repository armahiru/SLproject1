import appointmentModel from "../models/AppointmentModels.js";

// API to get student schedule
const getStudentSchedule = async (req, res) => {
    try {
        const { userId } = req.body;
        const appointments = await appointmentModel
            .find({ studentId: userId, status: 'APPROVED' })
            .populate('lecturerId', 'name email')
            .sort({ date: 1 });

        res.json({ success: true, schedule: appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get lecturer schedule
const getLecturerSchedule = async (req, res) => {
    try {
        const { userId } = req.body;
        const appointments = await appointmentModel
            .find({ lecturerId: userId, status: 'APPROVED' })
            .populate('studentId', 'name email')
            .sort({ date: 1 });

        res.json({ success: true, schedule: appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { getStudentSchedule, getLecturerSchedule };
