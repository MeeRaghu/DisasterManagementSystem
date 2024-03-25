// routes.js
const express = require('express');
const disasterController = require('../../src/controllers/disasterController.js');
const weatherController = require('../../src/controllers/weatherController.js');
const router=express.Router();
const cors=require('cors')
const {test,registerUser,loginUser,getProfile, logoutUser, forgotPassword,resetPassword}=require('../controllers/authController');
const {createResource}=require('../controllers/resourceController.js');


router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/profile',getProfile);
router.post('/logout',logoutUser);
router.post('/forgotPassword',forgotPassword);
router.post('/resetPassword',resetPassword);


router.post('/createResource',createResource);



const multer = require('multer');
const path = require('path');



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



router.post('/submitDisaster', upload.single('myFile'), disasterController.submitDisaster);
router.get('/getDisasters', disasterController.getDisasters);
router.put('/editDisaster/:id', upload.single('image'), disasterController.editDisaster);
router.delete('/deleteDisaster/:id', disasterController.deleteDisaster);
// Weather route
router.post('/getWeather', weatherController.getWeather);

module.exports = router;

