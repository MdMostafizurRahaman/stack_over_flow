const express = require('express')
const User = require('./modules/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRoute = require('./routes/authRoute')
const postRoute = require('./routes/postRoute')
const notificationRoute = require('./routes/notificationRoute')


const connectDB = require('./config/db')

const app = express()
app.use(express.json())


connectDB()


app.use('/', authRoute)
app.use('/', postRoute)
app.use('/', notificationRoute)

app.listen(3000, () => {
    console.log("Server started........")
})