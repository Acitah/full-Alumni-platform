const express = require('express')
const protect = require('../middlewares/protect');
const {getProfile, updateProfile} = require('../controllers/profile');
const {registerMember, loginMember} = require("../controllers/users")
const router = express.Router();

router.post('/register', registerMember);
router.post('/login', loginMember);
router.get('/profile',protect, getProfile);
router.patch('/profile', updateProfile);


module.exports = router;