// controllers/shoutout.js
const Shoutout = require('../models/shoutout');
const User = require('../models/users');

// Create Shoutout
const createShoutout = async (req, res) => {
  try {
    const { recipientId, message } = req.body;

    // Can't shoutout yourself
    if (recipientId === req.senderId) {
      return res.status(400).json({ 
        message: 'You cannot shoutout yourself' 
      });
    }

    const shoutout = await Shoutout.create({
      recipient: recipientId,
      sender: req.senderId,
      message
    });

    // Reward karma to recipient
    await User.findByIdAndUpdate(recipientId, 
      { $inc: { karma: 2 } }
    );

    res.status(201).json({ 
      message: 'Shoutout posted! +2 Karma to recipient', 
      data: shoutout 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get All Shoutouts
const getAllShoutouts = async (req, res) => {
  try {
    const shoutouts = await Shoutout.find({ isPublic: true })
      .populate('recipient', 'name avatar cohort')
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({ data: shoutouts });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Celebrate a Shoutout
const celebrateShoutout = async (req, res) => {
  try {
    const shoutout = await Shoutout.findById(req.params.shoutoutId);

    if (!shoutout) {
      return res.status(404).json({ message: 'Shoutout not found' });
    }

    if (shoutout.celebrations.includes(req.senderId)) {
      return res.status(400).json({ 
        message: 'Already celebrated this shoutout' 
      });
    }

    shoutout.celebrations.push(req.senderId);
    shoutout.celebrationCount += 1;
    await shoutout.save();

    res.status(200).json({ 
      message: 'Celebrated!', 
      celebrationCount: shoutout.celebrationCount 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Delete Shoutout
const deleteShoutout = async (req, res) => {
  try {
    const shoutout = await Shoutout.findById(req.params.shoutoutId);

    if (!shoutout) {
      return res.status(404).json({ message: 'Shoutout not found' });
    }

    if (shoutout.sender.toString() !== req.senderId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Shoutout.findByIdAndDelete(req.params.shoutoutId);

    res.status(200).json({ message: 'Shoutout deleted' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { 
  createShoutout, 
  getAllShoutouts, 
  celebrateShoutout, 
  deleteShoutout 
};