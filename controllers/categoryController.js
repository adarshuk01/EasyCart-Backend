// controllers/categoryController.js

const Category = require('../models/category');

// Create a new category or add subcategories
exports.createCategory = async (req, res) => {
    const { name, subcategories } = req.body;
  console.log(name,subcategories);
  
    try {
      const category = new Category({
        name,
        subcategories: subcategories.map(sub => ({ name: sub })),  // Format subcategories as an array of objects
      });

  
      const createdCategory = await category.save();
      res.status(201).json(createdCategory);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

// Get all categories (with nested parent-child relationships)
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
};

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('parent', 'name');
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      await category.remove();
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
