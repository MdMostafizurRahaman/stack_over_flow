const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./routes/authRoute');
const cors = require('cors'); // Add this line

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Add this line

// Routes
app.use('/user', userRoutes);

// Database connection
mongoose.connect(process.env.CONNECT_DB)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});