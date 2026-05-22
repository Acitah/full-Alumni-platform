// controllers/opportunity.js
const Opportunity = require('../models/opportunity');
// const Application = require('../models/application');
const User = require('../models/users');

// Post Opportunity
const postOpportunity = async (req, res) => {
  try {
    const {
      title, description, link,
      type, workType, referralOffer
    } = req.body;

    const opportunity = await Opportunity.create({
      title,
      description,
      link,
      type,
      workType,
      referralOffer,
      postedBy: req.senderId
    });

    // Reward karma for posting
    await User.findByIdAndUpdate(req.senderId,
      { $inc: { karma: 15 } }
    );

    res.status(201).json({
      message: 'Opportunity posted! +15 Karma',
      data: opportunity
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get All Opportunities
const getAllOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ isActive: true })
      .populate('postedBy', 'name avatar cohort')
      .sort({ createdAt: -1 });

    res.status(200).json({ data: opportunities });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get Single Opportunity
const getOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(
      req.params.opportunityId
    ).populate('postedBy', 'name avatar');

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    res.status(200).json({ data: opportunity });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Apply for Opportunity
const applyOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(
      req.params.opportunityId
    );

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    // Check already applied
    const alreadyApplied = await Application.findOne({
      opportunity: req.params.opportunityId,
      applicant: req.senderId
    });

    if (alreadyApplied) {
      return res.status(400).json({
        message: 'Already applied for this opportunity'
      });
    }

    const application = await Application.create({
      opportunity: req.params.opportunityId,
      applicant: req.senderId
    });

    // Track applicant
    opportunity.applicants.push(req.senderId);
    await opportunity.save();

    res.status(201).json({
      message: 'Application submitted successfully',
      data: application
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get My Applications
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.senderId
    })
    .populate('opportunity', 'title type workType referralOffer')
    .sort({ createdAt: -1 });

    res.status(200).json({ data: applications });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Update Application Status
const updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findById(
      req.params.applicationId
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = req.body.status;
    await application.save();

    res.status(200).json({
      message: `Application ${req.body.status}`,
      data: application
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Delete Opportunity
const deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(
      req.params.opportunityId
    );

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    if (opportunity.postedBy.toString() !== req.senderId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    opportunity.isActive = false;
    await opportunity.save();

    res.status(200).json({ message: 'Opportunity removed' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  postOpportunity, getAllOpportunities,
  getOpportunity, applyOpportunity,
  getMyApplications, updateApplicationStatus,
  deleteOpportunity
};