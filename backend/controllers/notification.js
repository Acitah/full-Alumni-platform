const Notification = require("../models/notification");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//Get notifications

const getNotification = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.senderId })
      .populate("sender", "name")
      .sort({ createdAt: -1 });

    res
      .status(201)
      .json({
        message: "Notifications fetched successfully",
        data: notifications,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error while fetching notifications ",
        error: error.message,
      });
  }
};

// Patch notifications
const updateNotification = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.senderId, isRead: false },
      { isRead: true },
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating notifications", error: error.message });
  }
};

//Delete notification

const deleteNotification = async (req, res) => {
  try {
    const notification = await Post.findById({ notification: req.params.id });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.recipient.toString() !== req.senderId) {
      return res
        .status(404)
        .json({ message: "Not authorized to perform task" });
    }

    await notification.deleteOne();
    return res
      .status(200)
      .json({ message: "Notification deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting notification", error: error.message });
  }
};

module.exports = {
  getNotification,
  updateNotification,
  deleteNotification,
};
