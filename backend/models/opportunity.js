// Opportunity/Job Post
const opportunitySchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String },
  type: {
    type: String,
    enum: ['job', 'scholarship', 'internship', 'contract'],
    default: 'job'
  },
  workType: {
    type: String,
    enum: ['remote', 'hybrid', 'onsite'],
    default: 'remote'
  },
  postedBy: { type: ObjectId, ref: 'User', required: true },
  referralOffer: { type: String, required: true },
  applicants: [{ type: ObjectId, ref: 'User' }],
  karmaReward: { type: Number, default: 15 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Application
const applicationSchema = mongoose.Schema({
  opportunity: { type: ObjectId, ref: 'Opportunity', required: true },
  applicant: { type: ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['applied', 'referred', 'rejected', 'hired'],
    default: 'applied'
  }
}, { timestamps: true });

module.exports = {
  Opportunity: mongoose.model('Opportunity', opportunitySchema),
  Application: mongoose.model('Application', applicationSchema)
};