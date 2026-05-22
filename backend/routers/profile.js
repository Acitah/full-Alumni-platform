const express = require('express')
const protect = require('../middlewares/protect');
const { getProfile, updateProfile } = require('../controllers/profile');

const router = express.Router();


router.get('/users/:userId', protect, getProfile);   // view anyone's profile
router.patch('/users/me', protect, updateProfile);    // edit your own profile
router.get('/users/me', protect, getProfile);       // get your own profile

