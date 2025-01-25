const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const notificationRoutes = require('./routes/notificationRoute');

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

app.use(bodyParser.json());
app.use(cors());

app.use('/notification', notificationRoutes);

mongoose.connect(process.env.CONNECT_DB)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

app.listen(port, () => {
    console.log(`Notification Service is listening on port ${port}`);
});
