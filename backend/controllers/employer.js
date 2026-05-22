// controllers/employer.js
const Employer = require('../models/employer');
// const IntroRequest = require('../models/introRequest');
const User = require('../models/users');

// Register Employer
const registerEmployer = async (req, res) => {
  try {
    const { companyName, email, password } = req.body;

    // Check if already registered
    const existing = await Employer.findOne({ email });
    if (existing) {
      return res.status(400).json({
        message: 'Company already registered'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const employer = await Employer.create({
      companyName,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: 'Employer registered successfully',
      data: {
        _id: employer._id,
        companyName: employer.companyName,
        email: employer.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Login Employer
const loginEmployer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const employer = await Employer.findOne({ email });

    if (!employer) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      employer.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: employer._id, email: employer.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      data: employer
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get Talent Pool
const getTalentPool = async (req, res) => {
  try {
    const employer = await Employer.findById(req.senderId);

    // Only subscribed employers can see full talent pool
    if (!employer.isSubscribed) {
      return res.status(403).json({
        message: 'Subscribe to access the full talent pool'
      });
    }

    // Filter by skill or ask
    const { skill, ask } = req.query;
    let filter = {};

    if (skill) filter.skills = { $in: [skill] };
    if (ask) filter.asks = { $in: [ask] };

    const talent = await User.find(filter)
      .select('name avatar skills asks jobTitle cohort isOpenToWork')
      .sort({ karma: -1 });

    res.status(200).json({ data: talent });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Subscribe as Partner
const subscribePartner = async (req, res) => {
  try {
    const employer = await Employer.findById(req.senderId);

    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    employer.isSubscribed = true;
    employer.subscriptionType = req.body.subscriptionType || 'basic';
    await employer.save();

    res.status(200).json({
      message: 'Subscription activated!',
      data: employer
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Request Introduction to Talent
const requestIntroduction = async (req, res) => {
  try {
    const employer = await Employer.findById(req.senderId);

    // Must be subscribed
    if (!employer.isSubscribed) {
      return res.status(403).json({
        message: 'Subscribe to request introductions'
      });
    }

    // Check already requested
    const alreadyRequested = await IntroRequest.findOne({
      employer: req.senderId,
      talent: req.params.talentId
    });

    if (alreadyRequested) {
      return res.status(400).json({
        message: 'Introduction already requested'
      });
    }

    const introRequest = await IntroRequest.create({
      employer: req.senderId,
      talent: req.params.talentId,
      message: req.body.message
    });

    res.status(201).json({
      message: 'Introduction request sent!',
      data: introRequest
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get My Intro Requests (Employer)
const getMyIntroRequests = async (req, res) => {
  try {
    const requests = await IntroRequest.find({
      employer: req.senderId
    })
    .populate('talent', 'name avatar skills cohort')
    .sort({ createdAt: -1 });

    res.status(200).json({ data: requests });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Respond to Intro Request (Talent)
const respondToIntroRequest = async (req, res) => {
  try {
    const request = await IntroRequest.findById(
      req.params.requestId
    );

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.talent.toString() !== req.senderId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.status = req.body.status; // accepted or declined
    await request.save();

    res.status(200).json({
      message: `Request ${req.body.status}`,
      data: request
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  registerEmployer, loginEmployer,
  getTalentPool, subscribePartner,
  requestIntroduction, getMyIntroRequests,
  respondToIntroRequest
};