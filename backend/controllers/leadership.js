
const Guild = require('../models/leadership');
// const Initiative = require('../models/initiative');
// const Election = require('../models/election');
const User = require('../models/users');

// ── GUILDS ──

// Create Guild
const createGuild = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    const guild = await Guild.create({
      name,
      description,
      category,
      leader: req.senderId,
      members: [req.senderId],
      memberCount: 1
    });

    res.status(201).json({
      message: 'Guild created successfully',
      data: guild
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get All Guilds
const getAllGuilds = async (req, res) => {
  try {
    const guilds = await Guild.find()
      .populate('leader', 'name avatar')
      .populate('members', 'name avatar cohort')
      .sort({ memberCount: -1 });

    res.status(200).json({ data: guilds });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Join Guild
const joinGuild = async (req, res) => {
  try {
    const guild = await Guild.findById(req.params.guildId);

    if (!guild) {
      return res.status(404).json({ message: 'Guild not found' });
    }

    // Check if already a member
    if (guild.members.includes(req.senderId)) {
      return res.status(400).json({
        message: 'You are already a member of this guild'
      });
    }

    guild.members.push(req.senderId);
    guild.memberCount += 1;
    await guild.save();

    res.status(200).json({
      message: 'Joined guild successfully',
      data: guild
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Leave Guild
const leaveGuild = async (req, res) => {
  try {
    const guild = await Guild.findById(req.params.guildId);

    if (!guild) {
      return res.status(404).json({ message: 'Guild not found' });
    }

    // Leader cannot leave
    if (guild.leader.toString() === req.senderId) {
      return res.status(400).json({
        message: 'Leader cannot leave — transfer leadership first'
      });
    }

    guild.members = guild.members.filter(
      id => id.toString() !== req.senderId
    );
    guild.memberCount -= 1;
    await guild.save();

    res.status(200).json({ message: 'Left guild successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Delete Guild
const deleteGuild = async (req, res) => {
  try {
    const guild = await Guild.findById(req.params.guildId);

    if (!guild) {
      return res.status(404).json({ message: 'Guild not found' });
    }

    if (guild.leader.toString() !== req.senderId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Guild.findByIdAndDelete(req.params.guildId);

    res.status(200).json({ message: 'Guild deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ── INITIATIVES ──

// Pitch Initiative
const pitchInitiative = async (req, res) => {
  try {
    const user = await User.findById(req.senderId);

    // Check karma
    if (user.karma < 20) {
      return res.status(400).json({
        message: 'Not enough karma to pitch an idea'
      });
    }

    const initiative = await Initiative.create({
      title: req.body.title,
      description: req.body.description,
      pitchedBy: req.senderId,
      karmaCost: 20
    });

    // Deduct karma
    await User.findByIdAndUpdate(req.senderId,
      { $inc: { karma: -20 } }
    );

    res.status(201).json({
      message: 'Initiative pitched! -20 Karma',
      data: initiative
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get All Initiatives
const getAllInitiatives = async (req, res) => {
  try {
    const initiatives = await Initiative.find()
      .populate('pitchedBy', 'name avatar cohort')
      .sort({ voteCount: -1 });

    res.status(200).json({ data: initiatives });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Vote on Initiative
const voteInitiative = async (req, res) => {
  try {
    const initiative = await Initiative.findById(
      req.params.initiativeId
    );

    if (!initiative) {
      return res.status(404).json({ message: 'Initiative not found' });
    }

    // Check already voted
    if (initiative.votes.includes(req.senderId)) {
      return res.status(400).json({
        message: 'Already voted on this initiative'
      });
    }

    initiative.votes.push(req.senderId);
    initiative.voteCount += 1;

    // Auto approve if enough votes
    if (initiative.voteCount >= 10) {
      initiative.status = 'approved';
    }

    await initiative.save();

    res.status(200).json({
      message: 'Vote cast!',
      voteCount: initiative.voteCount,
      status: initiative.status
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ── ELECTIONS ──

// Run for Election
const runForElection = async (req, res) => {
  try {
    const { role } = req.body;

    // Check if already running
    const alreadyRunning = await Election.findOne({
      candidate: req.senderId,
      isActive: true
    });

    if (alreadyRunning) {
      return res.status(400).json({
        message: 'You are already running for an election'
      });
    }

    const election = await Election.create({
      candidate: req.senderId,
      role,
      isActive: true
    });

    res.status(201).json({
      message: 'You are now running for election!',
      data: election
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get All Elections
const getAllElections = async (req, res) => {
  try {
    const elections = await Election.find({ isActive: true })
      .populate('candidate', 'name avatar cohort')
      .sort({ voteCount: -1 });

    res.status(200).json({ data: elections });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Vote in Election
const voteElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.electionId);

    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Can't vote for yourself
    if (election.candidate.toString() === req.senderId) {
      return res.status(400).json({
        message: 'You cannot vote for yourself'
      });
    }

    // Check already voted
    if (election.votes.includes(req.senderId)) {
      return res.status(400).json({
        message: 'Already voted in this election'
      });
    }

    election.votes.push(req.senderId);
    election.voteCount += 1;
    await election.save();

    // Reward karma for voting
    await User.findByIdAndUpdate(req.senderId,
      { $inc: { karma: 2 } }
    );

    res.status(200).json({
      message: 'Vote cast! +2 Karma',
      voteCount: election.voteCount
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createGuild, getAllGuilds, joinGuild,
  leaveGuild, deleteGuild,
  pitchInitiative, getAllInitiatives, voteInitiative,
  runForElection, getAllElections, voteElection
};