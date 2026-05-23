const { Guild, Council } = require("../models/leadership");
const User = require("../models/users");

// Councils

// Create council
const createCouncil = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    const council = await Council.create({
      name,
      description,
      category,
      steward: req.user.id,
      members: [req.user.id],
      memberCount: 1,
    });

    res.status(201).json({
      message: "Council created successfully",
      data: council,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Councils
const getAllCouncils = async (req, res) => {
  try {
    const guilds = await Council.find()
      .populate("steward", "name avatar")
      .populate("members", "name avatar cohort")
      .sort({ memberCount: -1 });

    res.status(200).json({ data: guilds });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Active Council Count (Village Pulse widget)
const getActiveCouncilCount = async (req, res) => {
  try {
    const count = await Council.countDocuments({ isActive: true });

    res.status(200).json({ activeCouncils: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Join Council
const joinCouncil = async (req, res) => {
  try {
    const council = await Council.findById(req.params.councilId);

    if (!council) {
      return res.status(404).json({ message: "Council not found" });
    }

    if (council.members.includes(req.user.id)) {
      return res.status(400).json({
        message: "You are already a member of this council",
      });
    }

    council.members.push(req.user.id);
    council.memberCount += 1;
    await council.save();

    res.status(200).json({
      message: "Joined council successfully",
      data: council,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Leave Council
const leaveCouncil = async (req, res) => {
  try {
    const council = await Council.findById(req.params.councilId);

    if (!council) {
      return res.status(404).json({ message: "Council not found" });
    }

    if (council.steward.toString() === req.user.id) {
      return res.status(400).json({
        message: "Steward cannot leave — transfer stewardship first",
      });
    }

    council.members = council.members.filter(
      (id) => id.toString() !== req.user.id,
    );
    council.memberCount -= 1;
    await council.save();

    res.status(200).json({ message: "Left council successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Nominate Steward (nominate another member, not yourself)
const nominateSteward = async (req, res) => {
  try {
    const { nomineeId } = req.body;
    const council = await Council.findById(req.params.councilId);

    if (!council) {
      return res.status(404).json({ message: "Council not found" });
    }

    if (!council.nominationOpen) {
      return res.status(400).json({
        message: "Steward nominations are not currently open",
      });
    }

    if (council.nominationPeriod?.closesAt) {
      const now = new Date();
      if (now > council.nominationPeriod.closesAt) {
        return res.status(400).json({
          message: `${council.nominationPeriod.quarter} nominations have closed`,
        });
      }
    }

    if (!council.members.includes(req.user.id)) {
      return res.status(403).json({
        message: "Only council members can nominate a steward",
      });
    }

    if (nomineeId === req.user.id) {
      return res.status(400).json({
        message: "You cannot nominate yourself as steward",
      });
    }

    if (!council.members.includes(nomineeId)) {
      return res.status(400).json({
        message: "Nominee must be a member of this council",
      });
    }
    council.nominatedSteward = nomineeId;
    council.nominatedBy = req.user.id;
    await council.save();

    res.status(200).json({
      message: "Steward nominated successfully",
      data: council,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Open Nominations (steward action)
const openNominations = async (req, res) => {
  try {
    const { quarter, opensAt, closesAt } = req.body;
    const council = await Council.findById(req.params.councilId);

    if (!council) {
      return res.status(404).json({ message: "Council not found" });
    }

    if (council.steward.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    council.nominationOpen = true;
    council.nominationPeriod = {
      quarter,
      opensAt: opensAt ? new Date(opensAt) : new Date(),
      closesAt: closesAt ? new Date(closesAt) : null,
    };
    await council.save();

    res.status(200).json({
      message: `${quarter} steward nominations are now open`,
      data: council,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Confirm Nominated Steward (transfer stewardship)
const confirmSteward = async (req, res) => {
  try {
    const council = await Council.findById(req.params.councilId);

    if (!council) {
      return res.status(404).json({ message: "Council not found" });
    }

    if (!council.nominatedSteward) {
      return res.status(400).json({ message: "No pending steward nomination" });
    }

    if (council.steward.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    council.steward = council.nominatedSteward;
    council.nominatedSteward = null;
    council.nominatedBy = null;
    council.nominationOpen = false;
    await council.save();

    res.status(200).json({
      message: "Stewardship transferred successfully",
      data: council,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Council (steward only)
const deleteCouncil = async (req, res) => {
  try {
    const council = await Council.findById(req.params.councilId);

    if (!council) {
      return res.status(404).json({ message: "Council not found" });
    }

    if (council.steward.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Council.findByIdAndDelete(req.params.councilId);

    res.status(200).json({ message: "Council deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get featured guilds for homepage
const getFeaturedGuilds = async (req, res) => {
  try {
    const featuredGuilds = await Guild.find({ featured: true })
      .populate("steward", "name avatar")
      .populate("members", "name avatar cohort");

    res.status(200).json({ data: featuredGuilds });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCouncil,
  getAllCouncils,
  joinCouncil,
  getActiveCouncilCount,
  leaveCouncil,
  deleteCouncil,
  getFeaturedGuilds,
  nominateSteward,
  openNominations,
  confirmSteward,
};
