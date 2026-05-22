const express = require('express')
const protect = require('../middlewares/protect');
const { postOpportunity, getAllOpportunities,
  getOpportunity, applyOpportunity,
  getMyApplications, updateApplicationStatus,
  deleteOpportunity } = require('../controllers/opportunity');

const router = express.Router();

router.post('/opportunities', protect, postOpportunity);
router.get('/opportunities', protect, getAllOpportunities);
router.get('/opportunities/:opportunityId', protect, getOpportunity);
router.post('/opportunities/:opportunityId/apply', protect, applyOpportunity);
router.get('/applications/my', protect, getMyApplications);
router.patch('/applications/:applicationId', protect, updateApplicationStatus);
router.delete('/opportunities/:opportunityId', protect, deleteOpportunity);

module.exports = router;