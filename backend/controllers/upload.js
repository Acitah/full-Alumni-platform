// controllers/users.js
const cloudinary = require('../config/cloudinary');

const uploadAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.senderId);

    // Delete old avatar if exists
    if (user.avatar.publicId) {
      await cloudinary.uploader.destroy(user.avatar.publicId);
    }

    // Save new avatar details
    user.avatar.url = req.file.path;
    user.avatar.publicId = req.file.filename;
    await user.save();

    res.status(200).json({
      message: 'Avatar uploaded successfully',
      avatar: user.avatar.url
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}