// Tracks every karma transaction
const karmaLogSchema = mongoose.Schema({
  user: { type: ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true }, // positive or negative
  reason: {
    type: String,
    enum: [
      'coffeeRoulette', 'mentorshipBooking', 'postOpportunity',
      'rsvpEvent', 'vote', 'shoutout', 'pitchIdea', 'answerQuestion'
    ]
  },
  reference: { type: ObjectId }, // ID of related document
}, { timestamps: true });