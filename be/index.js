const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoute = require('./routes/authRoute');
const postRoute = require('./routes/postRoute');
const notificationRoute = require('./routes/notificationRoute');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/', authRoute);
app.use('/', postRoute);
app.use('/', notificationRoute);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
