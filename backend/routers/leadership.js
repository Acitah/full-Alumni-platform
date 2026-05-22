
const express = require('express')
const protect = require('../middlewares/protect');
const { createGuild, getAllGuilds, joinGuild,
  leaveGuild, deleteGuild,
  pitchInitiative, getAllInitiatives, voteInitiative,
  runForElection, getAllElections, voteElection } = require('../controllers/leadership');

const router = express.Router();


// Guild routes
router.post('/guilds', protect, createGuild);
router.get('/guilds', protect, getAllGuilds);
router.patch('/guilds/:guildId/join', protect, joinGuild);
router.patch('/guilds/:guildId/leave', protect, leaveGuild);
router.delete('/guilds/:guildId', protect, deleteGuild);

// Initiative routes
router.post('/initiatives', protect, pitchInitiative);
router.get('/initiatives', protect, getAllInitiatives);
router.patch('/initiatives/:initiativeId/vote', protect, voteInitiative);

// Election routes
router.post('/elections', protect, runForElection);
router.get('/elections', protect, getAllElections);
router.patch('/elections/:electionId/vote', protect, voteElection);

module.exports = router;