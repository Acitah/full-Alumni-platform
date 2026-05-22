// controllers/spillTea.js
const SpillTea = require('../models/spillTea');
const User = require('../models/users');

// Create a Post
const createSpill = async (req, res) => {
  try {
    const { content, isAnonymous } = req.body;

    const spill = await SpillTea.create({
      content,
      isAnonymous: isAnonymous ?? true,
      author: req.senderId
    });

    res.status(201).json({ 
      message: 'Posted successfully', 
      data: spill 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get All Spills
const getAllSpills = async (req, res) => {
  try {
    const spills = await SpillTea.find({ isModerated: false })
      .populate({
        path: 'author',
        select: 'name avatar',
        // hide author if anonymous
        match: { isAnonymous: false }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ data: spills });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Support a Spill
const supportSpill = async (req, res) => {
  try {
    const spill = await SpillTea.findById(req.params.spillId);

    if (!spill) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check already supported
    if (spill.supports.includes(req.senderId)) {
      return res.status(400).json({ 
        message: 'Already supported this post' 
      });
    }

    spill.supports.push(req.senderId);
    spill.supportCount += 1;
    await spill.save();

    res.status(200).json({ 
      message: 'Support added', 
      supportCount: spill.supportCount 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Add Reply
const addReply = async (req, res) => {
  try {
    const spill = await SpillTea.findById(req.params.spillId);

    if (!spill) {
      return res.status(404).json({ message: 'Post not found' });
    }

    spill.replies.push({
      user: req.senderId,
      content: req.body.content,
      isAnonymous: req.body.isAnonymous ?? false
    });

    await spill.save();

    res.status(200).json({ 
      message: 'Reply added', 
      data: spill 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Delete Spill
const deleteSpill = async (req, res) => {
  try {
    const spill = await SpillTea.findById(req.params.spillId);

    if (!spill) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (spill.author.toString() !== req.senderId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await SpillTea.findByIdAndDelete(req.params.spillId);

    res.status(200).json({ message: 'Post deleted' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { 
  createSpill, 
  getAllSpills, 
  supportSpill, 
  addReply, 
  deleteSpill 
};