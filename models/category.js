const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  subcategories: [
    {
      name: { type: String, required: true },
    },
  ],
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
