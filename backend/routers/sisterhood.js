const express = require("express");
const protect = require("../middlewares/protect");
const {
  createEvent,
  getAllEvents,
  rsvpEvent,
  cancelRsvp,
  deleteEvent,
} = require("../controllers/sisterevents");

const {
  createShoutout,
  getAllShoutouts,
  celebrateShoutout,
  deleteShoutout,
  addComment,
} = require("../controllers/shout");

const router = express.Router();

// sisterEvent routes
router.post("/events", protect, createEvent);
router.get("/events", protect, getAllEvents);
router.patch("/events/:eventId/rsvp", protect, rsvpEvent);
router.patch("/events/:eventId/cancel-rsvp", protect, cancelRsvp); //done
router.delete("/events/:eventId", protect, deleteEvent);

// shoutout routes
router.post("/shoutout", protect, createShoutout);
router.get("/shoutout", protect, getAllShoutouts); //done
router.patch("/shoutout/:shoutoutId/celebrate", protect, celebrateShoutout);
router.delete("/shoutout/:shoutoutId", protect, deleteShoutout);
router.post("/shoutout/:shoutoutId/comment", protect, addComment);

module.exports = router;
