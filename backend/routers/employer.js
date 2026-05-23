const express = require('express')
const { protectEmployer } = require('../middlewares/permit');
const {registerEmployer, loginEmployer,
  getTalentPool, subscribePartner,
  requestIntroduction, getMyIntroRequests} = require('../controllers/employer');


// const {registerMember, loginMember} = require("../controllers/users");

const router = express.Router();

router.post('/intro/:talentId', protectEmployer, requestIntroduction);
router.get('/intro/requests', protectEmployer, getMyIntroRequests);

router.post('/register', registerEmployer);
router.post('/login', loginEmployer);
router.patch('/subscribe', protectEmployer, subscribePartner);
router.get('/talent', protectEmployer, getTalentPool);

// router.patch('/employers/intro/:requestId', protectEmployer, respondToIntroRequest);

module.exports = router;