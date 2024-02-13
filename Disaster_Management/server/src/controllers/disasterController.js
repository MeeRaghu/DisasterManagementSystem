const fs = require('fs').promises;
const Disaster = require('../models/disasterModel');
/*const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/assets');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const newFilename = 'image-' + uniqueSuffix + ext;
        cb(null, newFilename);
    }
});

const upload = multer({ storage: storage });*/

exports.submitDisaster = async (req, res) => {
    try {
        const { type, location, description, dateAndTime, severityLevel } = req.body;
        const imageNew = req.file ? req.file.filename : null;

        // Create a new disaster instance with the full image path
        const newDisaster = new Disaster({
            type,
            location,
            description,
            dateAndTime,
            severityLevel,
            image: imageNew,
        });

        // Save the disaster to the database
        const savedDisaster = await newDisaster.save();

        res.json(savedDisaster); // Return the created disaster object
        console.log("hello meera",savedDisaster);

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
