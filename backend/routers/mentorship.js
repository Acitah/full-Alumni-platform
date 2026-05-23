const express = require('express')
const protect = require('../middlewares/protect');
const { becomeMentor, getAllMentors,
  updateMentorProfile, toggleAvailability,
  bookMentor, getMyBookings, updateBookingStatus,
  postQuestion, getAllQuestions,
  answerQuestion, resolveQuestion } = require('../controllers/mentorship');

const router = express.Router();


// Mentorship routes
router.post('/mentors', protect, becomeMentor);
router.get('/mentors', protect, getAllMentors);
router.patch('/mentors/profile', protect, updateMentorProfile);
router.patch('/mentors/availability', protect, toggleAvailability);

// // Booking routes
// router.post('/bookings', protect, bookMentor);
// router.get('/bookings/my', protect, getMyBookings);
// router.patch('/bookings/:bookingId', protect, updateBookingStatus);

// // Quickfire routes
// router.post('/quickfire', protect, postQuestion);
// router.get('/quickfire', protect, getAllQuestions);
// router.post('/quickfire/:questionId/answer', protect, answerQuestion);
// router.patch('/quickfire/:questionId/resolve', protect, resolveQuestion);

module.exports = router;
