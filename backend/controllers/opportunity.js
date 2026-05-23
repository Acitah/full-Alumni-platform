// controllers/opportunity.js
const { Opportunity, Application } = require("../models/opportunity");
// const Application = require('../models/application');
const User = require("../models/users");

// Post Opportunity
const postOpportunity = async (req, res) => {
  try {
    const {
      title,
      description,
      link,
      type,
      workType,
      referralOffer,
      company,
      location,
      closingDate,
    } = req.body;

    const opportunity = await Opportunity.create({
      title,
      description,
      link,
      type,
      company,
      location,
      closingDate: new Date(closingDate),
      workType,
      referralOffer,
      postedBy: req.user.id,
    });

    // Reward karma for posting
    await User.findByIdAndUpdate(req.user.id, { $inc: { karma: 15 } });

    res.status(201).json({
      message: "Opportunity posted! +15 Karma",
      data: opportunity,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Opportunities
const getAllOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ isActive: true })
      .populate("postedBy", "name avatar cohort")
      .sort({ createdAt: -1 });

    res.status(200).json({ data: opportunities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Opportunity
const getOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(
      req.params.opportunityId,
    ).populate("postedBy", "name avatar");

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    res.status(200).json({ data: opportunity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Apply for Opportunity
const applyOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.opportunityId);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // Check already applied
    const alreadyApplied = await Application.findOne({
      opportunity: req.params.opportunityId,
      applicant: req.user.id,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        message: "Already applied for this opportunity",
      });
    }

    const application = await Application.create({
      opportunity: req.params.opportunityId,
      applicant: req.user.id,
    });

    // Track applicant
    opportunity.applicants.push(req.user.id);
    await opportunity.save();

    res.status(201).json({
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get My Applications
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user.id,
    })
      .populate("opportunity", "title type workType referralOffer")
      .sort({ createdAt: -1 });

    res.status(200).json({ data: applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Application Status
const updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = req.body.status;
    await application.save();

    res.status(200).json({
      message: `Application ${req.body.status}`,
      data: application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Opportunity
const deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.opportunityId);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    if (opportunity.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    opportunity.isActive = false;
    await opportunity.save();

    res.status(200).json({ message: "Opportunity removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  postOpportunity,
  getAllOpportunities,
  getOpportunity,
  applyOpportunity,
  getMyApplications,
  updateApplicationStatus,
  deleteOpportunity,
};

// postOpportunity,
//   getAllOpportunities,
//   getOpportunity,
//   applyOpportunity,
//   getMyApplications,
//   updateApplicationStatus,
//   getMyPostedOpportunities,
//   updateOpportunity,
//   deleteOpportunity,
