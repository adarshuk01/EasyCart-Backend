// config/db.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
    mongoose.connect(process.env.MONGO_URI)
    .then(res => console.log(`DATABASE CONNECTED SUCCESSFUL WITH ${res.connection.host}`))
    .catch(err => console.log(`DATABASE CONNECTION ERROR: ${err.message}`))
};

module.exports = connectDB;
