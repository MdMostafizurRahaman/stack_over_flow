const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Sign Up route
router.post('/signUp', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
    
        await newUser.save();
        res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Sign In route
router.post('/signIn', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password does not match' });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Generated Token:', token);

        return res.status(200).json({
            message: "Successfully logged in",
            token: token  
        });

    } catch (error) {
        res.status(500).json({ message: error.message });  
    }
});

// Get all users route
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();  // Fetch all users
        res.status(200).json(users);  // Send users in response
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

module.exports = router;
