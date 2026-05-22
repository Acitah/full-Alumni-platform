const express = require('express')
const protect = require('../middlewares/permit');
const {registerEmployer, loginEmployer,
  getTalentPool, subscribePartner,
  requestIntroduction, getMyIntroRequests,
  respondToIntroRequest} = require('../controllers/employer');
// const {registerMember, loginMember} = require("../controllers/users");

const router = express.Router();

router.post('/employers/register', registerEmployer);
router.post('/employers/login', loginEmployer);
router.get('/employers/talent', protectEmployer, getTalentPool);
router.patch('/employers/subscribe', protectEmployer, subscribePartner);
router.post('/employers/intro/:talentId', protectEmployer, requestIntroduction);
router.get('/employers/intro/requests', protectEmployer, getMyIntroRequests);
router.patch('/employers/intro/:requestId', protectEmployer, respondToIntroRequest);

module.exports = router;