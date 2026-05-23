const User = require("../models/users");
const IntroRequest = require("../models/introRequest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//REGISTRATION
const registerMember = async (req, res) => {
  try {
    const { email, name, password, confirmPassword } = req.body;
    console.log(req.body);
    const existingMember = await User.findOne({ email });
    if (existingMember) {
      return res.status(409).json({ message: "Account already exists" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newMember = new User({
      email,
      name: name,
      password: hashedPassword,
      confirmPassword: hashedPassword,
    });
    await newMember.save();

    const token = jwt.sign(
      { id: newMember._id, email: newMember.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res
      .status(201)
      .json({
        message: "Account created successfully",
        result: newMember,
        token,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error while creating account", error: error.message });
  }
};

//LOGIN
const loginMember = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const existingMember = await User.findOne({ email });

    if (!existingMember) {
      return res
        .status(404)
        .json({ message: "Account does not exist, please register" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingMember.password,
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    const token = jwt.sign(
      { id: existingMember._id, email: existingMember.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res
      .status(200)
      .json({ message: "Login Successful", result: existingMember, token });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error while signing in the User",
        error: error.message,
      });
  }
};

// Respond to Intro Request (Talent)
const respondToIntroRequest = async (req, res) => {
  try {
    const request = await IntroRequest.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.talent.toString() !== req.senderId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = req.body.status; // accepted or declined
    await request.save();

    res.status(200).json({
      message: `Request ${req.body.status}`,
      data: request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerMember, loginMember, respondToIntroRequest };
