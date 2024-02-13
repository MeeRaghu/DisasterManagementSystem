// routes.js
const express = require('express');
const disasterController = require('../../src/controllers/disasterController.js');
const weatherController = require('../../src/controllers/weatherController.js');

const multer = require('multer');
const path = require('path');

const router = express.Router();

//multer file part
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/assets');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const originalExtension = file.originalname.split('.').pop(); // Get the original file extension
        const filename = file.fieldname + '-' + uniqueSuffix + '.' + originalExtension;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

// Use the controller function for handling disaster submissions
router.post('/submitDisaster', upload.single('myFile'), disasterController.submitDisaster);
router.get('/getDisasters', disasterController.getDisasters);
// Weather route
router.post('/getWeather', weatherController.getWeather);
module.exports = router;
