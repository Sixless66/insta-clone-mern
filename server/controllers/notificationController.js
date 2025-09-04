import Notification from "../models/Notification.js";

// Get unseen notifications (unread only)
export const getUnseenNotifications = async (req, res) => {
  try {
    const userId = req.user._id; // maan le protect middleware se user mil raha hai

    // Find all unseen notifications for this user
    const unseenMessages = await Notification.find({
      receiver: userId,
      isRead: false
    })
    .populate({ path : 'sender', select : "sender userName profilePic"}).populate({ path : 'post', select : 'postImage'})
    .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: unseenMessages.length,
      unseenMessages,
      message : 'Notifications Fetched' 
    });
  } catch (error) { 
    console.error("Error fetching unseen notifications:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getAllNotifications = async (req, res) => {
   try {
        const notifcation = await Notification.find({});

        res.json({ success : true, notifcation })
   } catch (error) {
        res.json({ success : false, message : error.message});
   }
}

export const deleteAll = async (req, res) => {
   try {
         const notification = await Notification.deleteMany()

        res.json({ success : false, message : 'Notification deleted successfully', notification})
   } catch (error) {
       res.json({ success : false, message : error.message});
   }
}

export const subscribeToNotification = async (req, res) => {
  try {
    const to = req.user._id;

    // saare notification isRead true kar do
    await Notification.updateMany(
      { receiver: to },
      { $set: { isRead: true } }
    );

    res.json({
      success: true,
      message: "Notifications marked as seen"
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

