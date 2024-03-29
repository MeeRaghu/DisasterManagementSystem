const fs = require('fs').promises;
const Disaster = require('../models/disasterModel');
const User = require("../models/user");
const nodemailer = require("nodemailer");
exports.submitDisaster = async (req, res) => {
    try {
        const { type, location, description, dateAndTime, severityLevel } = req.body;
        console.log("Request Body:", req.body);

        const imageNew = req.file ? req.file.filename : null;
        const usersData = await User.find({ city: location }, "email");
        console.log("User Data:", usersData);

        if (usersData.length === 0) {
            console.log("No users found for the specified location");
           
        } else {
            const emailData = usersData.map((user) => user.email);
       const transporter = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
                user: 'adef07255@gmail.com', 
                pass: 'gvejzmyacwbbnvmu',
            },
        });

        const mailOptions = {
            from: 'adef07255@gmail.com',
        
                subject: "Disaster Alert",
                text: "There is a disaster alert in your location. Take necessary precautions.",
                to: emailData.join(", "),
            };
      
            await transporter.sendMail(mailOptions);
            console.log("Email sent successfully");
        }

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
exports.getDisasterInfo = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate if the provided ID is a valid ObjectId
        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        // Find the disaster by ID
        const disaster = await Disaster.findById(id);

        if (!disaster) {
            return res.status(404).json({ error: 'Disaster not found' });
        }

        res.json(disaster);
    } catch (error) {
        console.error('Error fetching disaster information:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
