const express = require('express')
const protect = require('../middlewares/protect');
const { createEvent, 
  getAllEvents, 
  rsvpEvent, 
  cancelRsvp, 
  deleteEvent  } = require('../controllers/sisterevents');
  const { joinRoulette, getMyRoulettes, completeSession, cancelRoulette } = require('../controllers/coffee');
const { createSpill, getAllSpills, supportSpill, addReply, deleteSpill } = require('../controllers/spill');
const { createShoutout, getAllShoutouts, celebrateShoutout, deleteShoutout } = require('../controllers/shout');
const { createIcebreaker, getAllIcebreakers, getRandomIcebreaker, deleteIcebreaker } = require('../controllers/ice');

const router = express.Router();



// coffeeRoulette routes
router.post('/', protect, joinRoulette);
router.get('/my', protect, getMyRoulettes);
router.patch('/:sessionId/complete', protect, completeSession);
router.patch('/cancel', protect, cancelRoulette);

// sisterEvent routes
router.post('/', protect, createEvent);
router.get('/', protect, getAllEvents);
router.patch('/:eventId/rsvp', protect, rsvpEvent);
router.patch('/:eventId/cancel-rsvp', protect, cancelRsvp);
router.delete('/:eventId', protect, deleteEvent);

// spillTea routes
router.post('/', protect, createSpill);
router.get('/', protect, getAllSpills);
router.patch('/:spillId/support', protect, supportSpill);
router.post('/:spillId/reply', protect, addReply);
router.delete('/:spillId', protect, deleteSpill);

// shoutout routes
router.post('/', protect, createShoutout);
router.get('/', protect, getAllShoutouts);
router.patch('/:shoutoutId/celebrate', protect, celebrateShoutout);
router.delete('/:shoutoutId', protect, deleteShoutout);

// icebreaker routes
router.post('/', protect, createIcebreaker);
router.get('/', protect, getAllIcebreakers);
router.get('/random', protect, getRandomIcebreaker);
router.delete('/:icebreakerId', protect, deleteIcebreaker);

module.exports = router;