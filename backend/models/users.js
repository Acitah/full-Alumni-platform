const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true },
  cohort: { type: Number, required: true },
  avatar: { type: String },
  bio: { type: String },
  skills: [{ type: String }],
  asks: [{ type: String }],
  role: {
    type: String,
    enum: ['member', 'admin', 'mentor'],
    default: 'member'
  },
 
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
