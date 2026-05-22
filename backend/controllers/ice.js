// controllers/icebreaker.js
const Icebreaker = require('../models/icebreaker');

// Create Icebreaker (admin only)
const createIcebreaker = async (req, res) => {
  try {
    const icebreaker = await Icebreaker.create({
      prompt: req.body.prompt,
      category: req.body.category,
      generatedBy: req.body.generatedBy || 'system'
    });

    res.status(201).json({ data: icebreaker });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get Random Icebreaker
const getRandomIcebreaker = async (req, res) => {
  try {
    const count = await Icebreaker.countDocuments({ isActive: true });
    const random = Math.floor(Math.random() * count);

    const icebreaker = await Icebreaker.findOne({ 
      isActive: true 
    }).skip(random);

    // Track usage
    icebreaker.usedCount += 1;
    await icebreaker.save();

    res.status(200).json({ data: icebreaker });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get All Icebreakers
const getAllIcebreakers = async (req, res) => {
  try {
    const icebreakers = await Icebreaker.find({ isActive: true });
    res.status(200).json({ data: icebreakers });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Delete Icebreaker
const deleteIcebreaker = async (req, res) => {
  try {
    const icebreaker = await Icebreaker.findById(req.params.icebreakerId);

    if (!icebreaker) {
      return res.status(404).json({ message: 'Icebreaker not found' });
    }

    icebreaker.isActive = false;
    await icebreaker.save();

    res.status(200).json({ message: 'Icebreaker removed' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { 
  createIcebreaker, 
  getRandomIcebreaker, 
  getAllIcebreakers, 
  deleteIcebreaker 
};