const User = require('../models/user');
const Resource=require('../models/resource');
const { hashPassword, comparePassword } = require('../helpers/auth');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Redis = require("ioredis");
const redisClient = new Redis();

redisClient.on("error", function(error) {
    console.error("Error connecting to Redis:", error);
});

// Set cache expiry time (1 hour)
const CACHE_EXPIRY_TIME = 3600; // in seconds

const test = (req, res) => {
    res.json('test is working');
};

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

        // Check if user exists in cache
        const cachedUser = await redisClient.get(email);
        if (cachedUser) {
            // User found in cache, return cached user
            const parsedUser = JSON.parse(cachedUser);
            console.log("cache verify",parsedUser);
            const match = await comparePassword(password, parsedUser.password);
            if (match) {
                jwt.sign({ email: parsedUser.email, id: parsedUser._id, name: parsedUser.name }, process.env.JWT_SECRET, {}, (err, token) => {
                    if (err) throw err;
                    // Set user token in cache
                    redisClient.set(token, JSON.stringify(parsedUser));
                    // Set cache expiry time for token
                    redisClient.expire(token, CACHE_EXPIRY_TIME);
                    res.cookie('token', token).json(parsedUser);
                });
            } else {
                res.json({
                    error: 'Password does not match',
                });
            }
            return; // Exit the function since user data is already retrieved from cache
        }

        // User not found in cache, proceed with database lookup
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
                // Set user token and user data in cache
                redisClient.set(email, JSON.stringify(user));
                redisClient.set(token, JSON.stringify(user));
                // Set cache expiry time for token
                redisClient.expire(token, CACHE_EXPIRY_TIME);
                res.cookie('token', token).json(user);
            });
        } else {
            res.json({
                error: 'Password does not match',
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get Profile Endpoint
const getProfile = async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.json(null);
        }

        // Check if profile exists in cache
        const cachedProfile = await redisClient.get(token);
       
        if (cachedProfile) {
            // Profile found in cache, return cached profile
            return res.json(JSON.parse(cachedProfile));
        }

        const user = await jwt.verify(token, process.env.JWT_SECRET);
        const userData = await User.findById(user.id);

        if (!userData) {
            return res.json(null);
        }

        const { name, email, isAdmin } = userData;
        // Set profile in cache
        redisClient.set(token, JSON.stringify({ name, email, isAdmin }));
        // Set cache expiry time for token
        redisClient.expire(token, CACHE_EXPIRY_TIME);
        res.json({ name, email, isAdmin });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Clear Cache for a User
const clearCache = (email) => {
    redisClient.del(email);
};

// Logout Endpoint
const logoutUser = (req, res) => {
    try {
        const { token } = req.cookies;
        if (token) {
            // Clear cache associated with the token
            redisClient.del(token);
        }
        // Clear the token cookie
        res.clearCookie('token');
        res.json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get User Data from Location
const getUserDataFromLocation = async (req, res, next) => {
    try {
        const location = req.body.location;
        const usersData = await User.findAll({ city: location });
        if (usersData) {
            return res.json({
                success: true,
                data: usersData
            });
        }
    } catch (e) {
        return res.json({
            success: false,
            message: 'Failed to load the data'
        });
    }
};

// Forgot Password Endpoint
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                error: 'No user found with this email',
            });
        }

        // Generate reset token
        const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send reset password link to user's email
        const resetLink = `http://localhost:3000/resetPassword?token=${resetToken}`;

        // Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'adef07255@gmail.com',
                pass: 'gvejzmyacwbbnvmu',
            },
        });
        
        const mailOptions = {
            from: 'adef07255@gmail.com',
            to: email,
            subject: 'Password Reset Request',
            html: `
                <p>Hello,</p>
                <p>You have requested to reset your password. Please click the link below to reset your password:</p>
                <a href="${resetLink}">Reset Password</a>
                <p>If you didn't request this, please ignore this email.</p>
            `,
        };
        
        transporter.sendMail(mailOptions, async (error, info) => {
            try {
                if (error) {
                    console.error("Error sending email:", error);
                    throw new Error(error); // Throw an error to capture it in the catch block
                } else {
                    console.log("Email sent:", info.response);
                    res.json({ message: 'Password reset link sent to your email' });
                }
            } catch (error) {
                console.error("Error sending email:", error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        }
        };
        
        // Reset Password Endpoint
        const resetPassword = async (req, res) => {
        try {
        const { token, password } = req.body;
        
        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }
        
        // Verify the reset token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if the token is valid
        if (!decodedToken) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }
        
        // Find the user by email
        const user = await User.findOne({ email: decodedToken.email });
        
        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Update the user's password
        user.password = await hashPassword(password);
        await user.save();
        
        // Clear cache associated with the user
        clearCache(user.email);
        
        // Respond with a success message
        res.json({ message: 'Password reset successfully' });
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        }
        };
        const getAllUsersByResource = async (req, res) => {
            try {
                // Find distinct userIds from the Resource model
                const userIds = await Resource.distinct('userId');
        
                // Fetch users based on the userIds obtained from Resource model
                const users = await User.find({ _id: { $in: userIds }, isAdmin: false });
        
                res.json({ users });
            } catch (error) {
                console.error('Error fetching all users:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        };
        
        module.exports = {
        test,
        registerUser,
        loginUser,
        getProfile,
        logoutUser,
        getUserDataFromLocation,
        forgotPassword,
        resetPassword,
       getAllUsersByResource
            
        };
        