// Mentor Profile
const mentorSchema = mongoose.Schema({
  user: { type: ObjectId, ref: 'User', required: true },
  offers: [{ type: String }], // Python, CV Review etc
  asks: [{ type: String }],   // UI/UX Insight etc
  availability: { type: Boolean, default: true },
  karmaCost: { type: Number, default: 15 },
  totalSessions: { type: Number, default: 0 }
}, { timestamps: true });

// Mentorship Booking
const bookingSchema = mongoose.Schema({
  mentor: { type: ObjectId, ref: 'User', required: true },
  mentee: { type: ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  karmaCost: { type: Number, default: 15 },
  sessionDate: { type: Date },
  duration: { type: Number, default: 60 } // minutes
}, { timestamps: true });

// Ask a Queen (Quickfire Questions)
const quickfireSchema = mongoose.Schema({
  question: { type: String, required: true },
  askedBy: { type: ObjectId, ref: 'User', required: true },
  answers: [{
    answeredBy: { type: ObjectId, ref: 'User' },
    content: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  isResolved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = {
  Mentor: mongoose.model('Mentor', mentorSchema),
  Booking: mongoose.model('Booking', bookingSchema),
  Quickfire: mongoose.model('Quickfire', quickfireSchema)
};