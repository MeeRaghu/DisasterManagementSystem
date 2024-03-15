// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const routes = require('./src/routes/route.js'); // Import the routes file
const app = express();
const port = process.env.PORT || 5500;
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const { hashPassword } = require('./src/helpers/auth');
const User = require('./src/models/user');




// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true, 
}));
app.use(express.json({ limit: '5mb' }));


mongoose.connect('mongodb://localhost:27017/disasterDB', { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

// Serve static assets in production (for example, React build)
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('frontend/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}
process.env.JWT_SECRET =1234567543;


// Use the routes defined in routes.js
app.use('/', routes);

app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/disasterDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB database connection established successfully');

        // Define admin credentials
        const adminCredentials = {
            name: 'Admin User',
            email: 'dmsadmin@gmail.com',
            password: 'admin@123', 
            confirmpassword: 'admin@123', 
            address: '123 BB Street',
            city: 'Brampton', 
            postalCode: 'L6S 6G3', 
            country: 'Canada', 
            isAdmin: true, 
        };

        // Check if admin user already exists
        User.findOne({ email: adminCredentials.email })
            .then(existingAdmin => {
                if (existingAdmin) {
                    console.log('Admin user already exists:', existingAdmin);
                } else {
                    // Hash the password
                    hashPassword(adminCredentials.password)
                        .then(hashedPassword => {
                            adminCredentials.password = hashedPassword;
                            // Insert admin credentials into the database
                            User.create(adminCredentials)
                                .then(admin => {
                                    console.log('Admin credentials inserted successfully:', admin);
                                })
                                .catch(error => {
                                    console.error('Error inserting admin credentials:', error);
                                });
                        })
                        .catch(error => {
                            console.error('Error hashing password:', error);
                        });
                }
            })
            .catch(error => {
                console.error('Error checking for existing admin user:', error);
            });
    })
    .catch(error => {
        console.error('Error connecting to MongoDB:', error);
    });



// Start server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
process.on('SIGINT', () => {
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});