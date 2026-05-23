const express = require("express");
const protect = require("../middlewares/protect");
const { getProfile, updateProfile } = require("../controllers/profile");
const { registerMember, loginMember } = require("../controllers/users");
const { respondToIntroRequest } = require("../controllers/users");
const router = express.Router();

router.post("/register", registerMember);
router.post("/login", loginMember);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

router.patch("/employers/intro/:requestId", protect, respondToIntroRequest);

module.exports = router;
