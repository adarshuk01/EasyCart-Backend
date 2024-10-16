// server.js

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const routes = require('./routes');
const cors = require('cors'); // Import the cors package

dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Enable CORS for specific origin
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow credentials (like cookies) to be sent
};

app.use(cors(corsOptions)); // Use the CORS options

// Connect to the database
connectDB();

// Use routes
app.use('/api', routes);

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
