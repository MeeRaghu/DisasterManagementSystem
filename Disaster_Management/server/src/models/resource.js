const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  disasterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Disaster', // Reference to the Disaster model
    required: true
  },
  resourceType: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  urgency: {
    type: String,
    required: true
  },
  comments: {
    type: String
  },
  isApproved: {
    type: Boolean,
    default: null // Default value is null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
