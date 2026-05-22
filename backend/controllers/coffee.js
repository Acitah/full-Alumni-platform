// controllers/coffeeRoulette.js
const CoffeeRoulette = require('../models/coffeeRoulette');
const User = require('../models/users');

// Join Coffee Roulette
const joinRoulette = async (req, res) => {
  try {
    const user = await User.findById(req.senderId);

    // Check karma balance
    if (user.karma < 10) {
      return res.status(400).json({ 
        message: 'Not enough karma to join Coffee Roulette' 
      });
    }

    // Check if already pending
    const alreadyJoined = await CoffeeRoulette.findOne({
      user: req.senderId,
      status: 'pending'
    });

    if (alreadyJoined) {
      return res.status(400).json({ 
        message: 'You are already waiting for a match' 
      });
    }

    // Find someone to match with
    const potentialMatch = await CoffeeRoulette.findOne({
      status: 'pending',
      user: { $ne: req.senderId } // not the same user
    });

    if (potentialMatch) {
      // Match found — update both
      potentialMatch.matchedWith = req.senderId;
      potentialMatch.status = 'matched';
      await potentialMatch.save();

      // Deduct karma from both
      await User.findByIdAndUpdate(req.senderId, 
        { $inc: { karma: -10 } }
      );
      await User.findByIdAndUpdate(potentialMatch.user, 
        { $inc: { karma: -10 } }
      );

      return res.status(200).json({
        message: 'Match found!',
        matchedWith: potentialMatch.user
      });
    }

    // No match yet — create pending entry
    const newEntry = await CoffeeRoulette.create({
      user: req.senderId,
      status: 'pending',
      karmaCost: 10
    });

    res.status(201).json({
      message: 'Added to pool — waiting for match',
      data: newEntry
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Complete a Coffee Roulette session
const completeSession = async (req, res) => {
  try {
    const session = await CoffeeRoulette.findById(req.params.sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.status = 'completed';
    session.notes = req.body.notes;
    await session.save();

    // Reward karma on completion
    await User.findByIdAndUpdate(req.senderId, 
      { $inc: { karma: 5 } }
    );

    res.status(200).json({ message: 'Session completed!', data: session });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get my Coffee Roulette history
const getMyRoulettes = async (req, res) => {
  try {
    const sessions = await CoffeeRoulette.find({
      $or: [
        { user: req.senderId },
        { matchedWith: req.senderId }
      ]
    })
    .populate('user', 'name avatar cohort')
    .populate('matchedWith', 'name avatar cohort')
    .sort({ createdAt: -1 });

    res.status(200).json({ data: sessions });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Cancel Coffee Roulette
const cancelRoulette = async (req, res) => {
  try {
    const session = await CoffeeRoulette.findOne({
      user: req.senderId,
      status: 'pending'
    });

    if (!session) {
      return res.status(404).json({ message: 'No pending session found' });
    }

    session.status = 'cancelled';
    await session.save();

    // Refund karma
    await User.findByIdAndUpdate(req.senderId, 
      { $inc: { karma: 10 } }
    );

    res.status(200).json({ message: 'Roulette cancelled, karma refunded' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { 
  joinRoulette, 
  completeSession, 
  getMyRoulettes, 
  cancelRoulette 
};