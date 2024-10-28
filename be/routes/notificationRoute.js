const express = require('express')
const router = express.Router()
const Notification = require('../models/Notification')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/notification', authMiddleware, async(req, res) => {
    const notification = await Notification.find()
    if(notification){
        res.status(200).json(notification)
        console.log(notification)
    }
    else{
        res.status(400).json({message: "No Notification Found"})
        console.log(error)
    }
})

module.exports = router