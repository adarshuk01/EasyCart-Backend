// models/Product.js

const mongoose = require('mongoose');

// Define the Product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxLength: [100, 'Product name should not exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price for the product'],
    maxLength: [5, 'Product price should not exceed 99999'],
    default: 0.0,
  },
  // Change category to reference the Category model
  category: {
    type: mongoose.Schema.Types.ObjectId,   // Reference to Category model
    ref: 'Category',                        // Link to the Category schema
    required: [true, 'Please specify a category for the product'],
  },
  subcategories: {
    type: mongoose.Schema.Types.ObjectId,   // Reference to Category model
    ref: 'Category',                        // Link to the Category schema
    required: [true, 'Please specify a category for the product'],
  },
  image: {
    url: { type: String, required: true },    // Cloudinary image URL
    public_id: { type: String, required: true } // Cloudinary public_id for deletion
  },
  brand: {
    type: String,
    required: [true, 'Please provide the brand of the product'],
  },
  stock: {
    type: Number,
    required: [true, 'Please specify the stock quantity'],
    maxLength: [5, 'Stock quantity cannot exceed 99999'],
    default: 0,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Assuming you have a User model for customers
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Use the existing model if it exists, otherwise create a new one
module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
