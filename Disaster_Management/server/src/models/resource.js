const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
