
const express = require('express')
const protect = require('../middlewares/protect');
const { createCouncil, getAllCouncils, joinCouncil, getActiveCouncilCount,
  leaveCouncil, deleteCouncil, getFeaturedGuilds,
 nominateSteward, openNominations, confirmSteward } = require('../controllers/leadership');

const router = express.Router();

// Guild route
router.get('/guilds/featured', getFeaturedGuilds);
 
// Council routes
router.get('/councils', getAllCouncils);
router.get('/councils/pulse', getActiveCouncilCount);
router.post('/councils', protect, createCouncil);
router.post('/councils/:councilId/join', protect, joinCouncil);
router.post('/councils/:councilId/leave', protect, leaveCouncil);
router.post('/councils/:councilId/nominate', protect, nominateSteward);
router.post('/councils/:councilId/open-nominations', protect, openNominations);            //done
router.post('/councils/:councilId/confirm-steward',  protect, confirmSteward);
router.delete('/councils/:councilId', protect, deleteCouncil);
 

module.exports = router;