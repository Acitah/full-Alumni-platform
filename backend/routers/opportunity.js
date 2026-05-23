const express = require('express')
const protect = require('../middlewares/protect');
const { postOpportunity, getAllOpportunities,
  getOpportunity, applyOpportunity,
  getMyApplications, updateApplicationStatus,
  deleteOpportunity } = require('../controllers/opportunity');

const router = express.Router();

router.post('/', protect, postOpportunity);
router.get('/', protect, getAllOpportunities);
router.get('/my', protect, getMyApplications);
router.get('/:opportunityId', protect, getOpportunity);
router.post('/:opportunityId/apply', protect, applyOpportunity);
router.patch('/:applicationId', protect, updateApplicationStatus);
router.delete('/:opportunityId', protect, deleteOpportunity);

module.exports = router;