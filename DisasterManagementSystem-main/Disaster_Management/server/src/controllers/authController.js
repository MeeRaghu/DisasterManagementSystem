const User = require('../models/user');
const { hashPassword, comparePassword } = require('../helpers/auth');
const jwt = require('jsonwebtoken');

const test = (req, res) => {
    res.json('test is working');
};

// Register Endpoint
// Register Endpoint
const registerUser = async (req, res) => {
    try {
        const { name, email, password, confirmpassword, address, city, postalCode, country } = req.body;

        // Check if name, email, and password were entered
        if (!name || !email || !password) {
            return res.json({
                error: 'Name, email, and password are required',
            });
        }

        // Check if password is at least 6 characters long
        if (password.length < 6) {
            return res.json({
                error: 'Password should be at least 6 characters long',
            });
        }

        // Check if passwords match
        if (password !== confirmpassword) {
            return res.json({
                error: 'Passwords do not match',
            });
        }

        // Check if email is taken
        const exist = await User.findOne({ email });
        if (exist) {
            return res.json({
                error: 'Email is taken already',
            });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create user in the database
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            confirmpassword,
            address,
            city,
            postalCode,  
            country,
        });

        return res.json(user);
    } catch (error) {
        console.log(error);
    }
};


// Login Endpoint
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                error: 'No user found',
            });
        }

        // Check if password matches
        const match = await comparePassword(password, user.password);
        if (match) {
            jwt.sign({ email: user.email, id: user._id, name: user.name }, process.env.JWT_SECRET, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(user);
            });
        }

        if (!match) {
            res.json({
                error: 'Password does not match',
            });
        }
    } catch (error) {
        console.log(error);
    }
};

const getProfile = (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if (err) throw err;
            res.json(user);
        });
    } else {
        res.json(null);
    }
};

const getUserDataFromLocation = async (req, res, next) => {
    try{
        const location = req.body.location
        const usersData = await User.findAll({ city: location });
        if (usersData) {
            return res.json({
                success: true,
                data: usersData
            });
        }
    }
    catch(e){
        return response.json({
            success: false,
            message: 'Failed to load the data'
        })
    }
}

module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile,
    getUserDataFromLocation
};
