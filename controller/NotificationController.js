import notificationModel from "../models/NotificationModels.js";

// API to get user notifications
const getNotifications = async (req, res) => {
    try {
        const { userId } = req.body;
        const notifications = await notificationModel
            .find({ userId })
            .sort({ createdAt: -1 });

        res.json({ success: true, notifications });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to mark notification as read
const markAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id || req.body.notificationId;

        await notificationModel.findByIdAndUpdate(notificationId, { status: 'READ' });

        res.json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { getNotifications, markAsRead };
