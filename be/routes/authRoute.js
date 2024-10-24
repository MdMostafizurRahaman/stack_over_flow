// const express = require('express')
// const router = express.Router()
// const dotenv = require('dotenv')
// dotenv.config()
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../modules/User');


// router.post('/signUp', async(req, res) => {
//     try {
//         const {email, password} = req.body
        
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: 'Email already exists' });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10)
//         const newUser = new User({ email, password: hashedPassword}) 
    
//         await newUser.save()
//         res.status(200).json({message: 'User created successfully'})
//     } catch (error) {
//         res.send(500).json({message: error.message})
//     }
// })

// router.post('/signIn', async(req, res) => {
//     try {
//         const {email, password} = req.body

//         const user = await User.findOne({email})
//         if(!user){
//             return res.status(400).json({message: 'User not found'})
//         }

//         const isMatch = await bcrypt.compare(password, user.password)
//         if(!isMatch){
//             return res.status(400).json({message: 'Password not match'})
//         }
//         return res.status(200).json({message: "Successfully login"})

//         const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.json({ token });
//     } catch (error) {
//         res.send(500).json(message, error.message)
//     }
// })


// module.exports = router


const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../modules/User');

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
        res.status(500).json({ message: error.message });  // Fixed typo and status code
    }
});

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

        // Generate JWT token
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Print token in console
        console.log('Generated Token:', token);

        // Send response with token
        return res.status(200).json({
            message: "Successfully logged in",
            token: token  // Include token in response
        });

    } catch (error) {
        res.status(500).json({ message: error.message });  // Fixed typo and status code
    }
});

module.exports = router;