'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * disaster Schema
 **/
const disasterSchema = new Schema({
    type: {
        type: String,
        trim: true,
        required: true,
    },
    location: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    dateAndTime: { 
        type: Date, 
        required: true 
    },
    severityLevel: 
    { type: String, enum: ['low', 'moderate', 'high'],
    required: true 
    },
    image: {
        type: String, // Assuming you're storing the image path
        trim: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Disaster', disasterSchema);
