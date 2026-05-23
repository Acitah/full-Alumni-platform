const Message = require("../models/message");
const Notification = require("../models/notification");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//Post messages
//Send a message to another alumni
const sendMessage = async (req, res) => {
  try {
    //uses message model to create a new message document in the database, with sender, recipient and content fields. The sender and recipient are expected to be user IDs, and the content is the text of the message. After saving the message, it responds with a success message and the saved message data.
    const { senderId, receiverId, content } = req.body;

    if (senderId === receiverId) {
      return res.status(400).json({ message: "You cannot message yourself" });
    }

    const message = new Message({
      sender: senderId,
      recipient: receiverId,
      content,
    });

    await message.save();

    //Create a notification for the recipient when a new message is sent. It uses the Notification model to create a new notification document in the database, with recipient, sender, notificationType and message fields. The notificationType is set to 'newMessage', and the message field contains a string indicating that the recipient has a new message from the sender. After saving the notification, it responds with a success message and the saved message data.

    await Notification.create({
      recipient: receiverId,
      sender: senderId,
      notificationType: "newMessage",
      message: `You have a new message from ${senderId}`,
    });
    res.status(200).json({ message: "Message sent!", data: message });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while sending message", error: error.message });
  }
};

//Get messages

const getMessage = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.senderId, recipient: req.params.receiverId },
        { sender: req.params.receiverId, recipient: req.senderId },
      ],
    })
      .populate("sender", "name")
      .populate("recipient", "name")
      .sort({ createdAt: 1 });

    res
      .status(200)
      .json({ message: "Messages fetched successfully", data: messages });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching conversation", error: error.message });
  }
};

//Patch messages

const patchMessage = async (req, res) => {
  try {
    const existingMessage = await Message.findById(req.params.messageId);

    if (!existingMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (existingMessage.recipient.toString() !== req.senderId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    existingMessage.isRead = true;
    await existingMessage.save();

    return res.status(200).json({ message: "Message marked as read" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating message", error: error.message });
  }
};

//Delete message

const deleteMessage = async (req, res) => {
  try {
    const existingMessage = await Message.findById(req.params.messageId);

    if (!existingMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (
      existingMessage.sender.toString() !== req.senderId &&
      existingMessage.recipient.toString() !== req.senderId
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this message" });
    }

    await Message.findByIdAndDelete(req.params.messageId);

    return res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while deleting message", error: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessage,
  patchMessage,
  deleteMessage,
};
