const fs = require('fs').promises;
const Disaster = require('../models/disasterModel');

exports.submitDisaster = async (req, res) => {
    try {
        const { type, location, description, dateAndTime, severityLevel } = req.body;
        const imageNew = req.file ? req.file.filename : null;

        const newDisaster = new Disaster({
            type,
            location,
            description,
            dateAndTime,
            severityLevel,
            image: imageNew,
        });

        const savedDisaster = await newDisaster.save();

        res.json(savedDisaster);
        console.log("Disaster submitted successfully:", savedDisaster);
    } catch (error) {
        console.error('Error submitting disaster:', error);
        res.status(400).json('Error: ' + error.message);
    }
};

exports.getDisasters = async (req, res) => {
    try {
        const disasters = await Disaster.find();
        res.json(disasters);
    } catch (error) {
        console.error('Error fetching disasters:', error);
        res.status(500).json('Error fetching disasters');
    }
};
const { isValidObjectId } = require('mongoose');

exports.editDisaster = async (req, res) => {
  const { type, location, description, dateAndTime, severityLevel } = req.body;
  const imageNew = req.file ? req.file.filename : null;

  try {
      // Ensure that the provided ID is a valid ObjectId
      if (!isValidObjectId(req.params.id)) {
          return res.status(400).json('Invalid ID format');
      }

      // Find the existing disaster by ID
      const existingDisaster = await Disaster.findById(req.params.id);

      // Debug logging
      console.log('Existing Disaster:', existingDisaster);
      console.log('Updated Image:', imageNew);

      // Create an object with the updated values
      const updatedData = {
          type,
          location,
          description,
          dateAndTime,
          severityLevel,
      };

      // Update the image only if a new file is provided
      if (imageNew) {
          updatedData.image = imageNew;

          // Remove the existing image if it exists
          if (existingDisaster.image) {
              await fs.unlink(`./public/assets/${existingDisaster.image}`);
          }
      }

      // Debug logging
      console.log('Updated Data:', updatedData);

      // Use the $set operator to update only the provided fields
      const updatedDisaster = await Disaster.findByIdAndUpdate(
          req.params.id,
          { $set: updatedData },
          { new: true }
      );

      // Debug logging
      console.log('Updated Disaster:', updatedDisaster);

      if (!updatedDisaster) {
          return res.status(404).json('Disaster not found');
      }

      res.json(updatedDisaster);
      console.log('Disaster updated successfully:', updatedDisaster);
  } catch (error) {
      console.error('Error updating disaster:', error);
      res.status(500).json('Error: ' + error.message);
  }
};


exports.deleteDisaster = async (req, res) => {
    try {
        const deletedDisaster = await Disaster.findByIdAndDelete(req.params.id);

        if (deletedDisaster.image) {
            // Remove the associated image if it exists
            await fs.unlink(`./public/assets/${deletedDisaster.image}`);
        }

        res.json(deletedDisaster);
        console.log('Disaster deleted successfully:', deletedDisaster);
    } catch (error) {
        console.error('Error deleting disaster:', error);
        res.status(400).json('Error: ' + error.message);
    }
};
