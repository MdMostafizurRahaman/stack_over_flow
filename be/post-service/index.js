const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); 
const postRoutes = require('./routes/postRoute'); // Import the post routes

dotenv.config();

const app = express();
const port = process.env.PORT || 3003;

app.use(bodyParser.json());
app.use(cors()); 

app.use('/', postRoutes); 

mongoose.connect(process.env.CONNECT_DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

app.listen(port, () => {
    console.log(`Post Service is listening on port ${port}`);
});