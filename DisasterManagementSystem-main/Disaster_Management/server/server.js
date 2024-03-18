// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const routes = require('./src/routes/route.js'); // Import the routes file
const app = express();
const port = process.env.PORT || 5500;

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Connect to MongoDB (replace 'your_database_url' with your actual MongoDB connection string)
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