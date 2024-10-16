// controllers/adminController.js

const User = require('../models/user'); // User model
const Product=require('../models/Product');
const Order=require('../models/orders')

const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken');

// Admin Registration
exports.registerAdmin = async (req, res) => {
    const { username, email, password ,firstName,lastName } = req.body;

    try {
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new User({
            username,
            email,
            firstName,
            lastName,
            password: hashedPassword,
            isAdmin: true, // Set isAdmin to true for admin registration
        });

        await newAdmin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Admin Login
exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await User.findOne({ email, isAdmin: true }); // Check if user is admin
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials or not an admin' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Assuming you have JWT setup
        const token = jwt.sign({ id: admin._id, isAdmin: admin.isAdmin }, process.env.JWT_SECRET, {
            expiresIn: '3h',
        });

        res.status(200).json({ token, message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
    try {
      const totalProducts = await Product.countDocuments();
      const totalOrders = await Order.countDocuments();
      const totalUsers = await User.countDocuments();
      const totalRevenue = await Order.aggregate([
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]);
  
      res.status(200).json({
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue: totalRevenue[0]?.total || 0, // Safeguard against empty results
      });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving dashboard stats', error });
    }
  };
