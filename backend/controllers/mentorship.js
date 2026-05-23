// controllers/mentorship.js
const Mentor = require("../models/mentorship");
// const Booking = require('../models/booking');
// const Quickfire = require('../models/quickfire');
const User = require("../models/users");

// ── MENTOR PROFILES ──

// Become a Mentor
const becomeMentor = async (req, res) => {
  try {
    const { offers, asks, karmaCost } = req.body;

    // Check if already a mentor
    const existing = await Mentor.findOne({ user: req.senderId });
    if (existing) {
      return res.status(400).json({
        message: "You are already registered as a mentor",
      });
    }

    const mentor = await Mentor.create({
      user: req.senderId,
      offers,
      asks,
      karmaCost: karmaCost || 15,
    });

    res.status(201).json({
      message: "Mentor profile created!",
      data: mentor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Mentors
const getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({ availability: true })
      .populate("user", "name avatar cohort bio")
      .sort({ totalSessions: -1 });

    res.status(200).json({ data: mentors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Mentor Profile
const updateMentorProfile = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.senderId });

    if (!mentor) {
      return res.status(404).json({ message: "Mentor profile not found" });
    }

    const updatedMentor = await Mentor.findByIdAndUpdate(mentor._id, req.body, {
      new: true,
    });

    res.status(200).json({
      message: "Profile updated",
      data: updatedMentor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle Availability
const toggleAvailability = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.senderId });

    if (!mentor) {
      return res.status(404).json({ message: "Mentor profile not found" });
    }

    mentor.availability = !mentor.availability;
    await mentor.save();

    res.status(200).json({
      message: `You are now ${mentor.availability ? "available" : "unavailable"}`,
      availability: mentor.availability,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── BOOKINGS ──

// Book a Mentor
const bookMentor = async (req, res) => {
  try {
    const { mentorId, sessionDate } = req.body;
    const user = await User.findById(req.senderId);

    // Check karma
    if (user.karma < 15) {
      return res.status(400).json({
        message: "Not enough karma to book a mentor",
      });
    }

    // Can't book yourself
    if (mentorId === req.senderId) {
      return res.status(400).json({
        message: "You cannot book yourself",
      });
    }

    // Check mentor exists and available
    const mentor = await Mentor.findOne({
      user: mentorId,
      availability: true,
    });

    if (!mentor) {
      return res.status(404).json({
        message: "Mentor not found or unavailable",
      });
    }

    const booking = await Booking.create({
      mentor: mentorId,
      mentee: req.senderId,
      sessionDate,
      karmaCost: mentor.karmaCost,
    });

    // Deduct karma from mentee
    await User.findByIdAndUpdate(req.senderId, { $inc: { karma: -15 } });

    res.status(201).json({
      message: "Booking confirmed! -15 Karma",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get My Bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      $or: [{ mentor: req.senderId }, { mentee: req.senderId }],
    })
      .populate("mentor", "name avatar")
      .populate("mentee", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({ data: bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Booking Status
const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only mentor can confirm or cancel
    if (booking.mentor.toString() !== req.senderId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = req.body.status;
    await booking.save();

    // If completed reward mentor karma
    if (req.body.status === "completed") {
      await User.findByIdAndUpdate(req.senderId, { $inc: { karma: 10 } });

      // Update total sessions
      await Mentor.findOneAndUpdate(
        { user: req.senderId },
        { $inc: { totalSessions: 1 } },
      );
    }

    // If cancelled refund mentee
    if (req.body.status === "cancelled") {
      await User.findByIdAndUpdate(booking.mentee, { $inc: { karma: 15 } });
    }

    res.status(200).json({
      message: `Booking ${req.body.status}`,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── QUICKFIRE QUESTIONS ──

// Post a Question
const postQuestion = async (req, res) => {
  try {
    const question = await Quickfire.create({
      question: req.body.question,
      askedBy: req.senderId,
    });

    res.status(201).json({
      message: "Question posted!",
      data: question,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Questions
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Quickfire.find()
      .populate("askedBy", "name avatar cohort")
      .sort({ createdAt: -1 });

    res.status(200).json({ data: questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Answer a Question
const answerQuestion = async (req, res) => {
  try {
    const question = await Quickfire.findById(req.params.questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    question.answers.push({
      answeredBy: req.senderId,
      content: req.body.content,
    });

    await question.save();

    // Reward karma for answering
    await User.findByIdAndUpdate(req.senderId, { $inc: { karma: 5 } });

    res.status(200).json({
      message: "Answer posted! +5 Karma",
      data: question,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark Question as Resolved
const resolveQuestion = async (req, res) => {
  try {
    const question = await Quickfire.findById(req.params.questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (question.askedBy.toString() !== req.senderId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    question.isResolved = true;
    await question.save();

    res.status(200).json({ message: "Question marked as resolved" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  becomeMentor,
  getAllMentors,
  updateMentorProfile,
  toggleAvailability,
  bookMentor,
  getMyBookings,
  updateBookingStatus,
  postQuestion,
  getAllQuestions,
  answerQuestion,
  resolveQuestion,
};
