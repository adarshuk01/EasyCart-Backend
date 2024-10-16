// controllers/customerController.js

const Customer = require('../models/user'); // Assuming 'User' model is used for customers

// Get all customers (Admin only)
exports.getAllCustomers = async (req, res) => {
  const customers = await Customer.find({});
  res.json(customers);
};

// Delete a customer (Admin only)
exports.deleteCustomer = async (req, res) => {
    try {
      const customer = await Customer.findById(req.params.id); // Find the customer by ID
  
      if (customer) {
        await Customer.findByIdAndDelete(req.params.id); // Delete the customer from the database
        res.json({ message: 'Customer removed successfully' });
      } else {
        res.status(404).json({ message: 'Customer not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  