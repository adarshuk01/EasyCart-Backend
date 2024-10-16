const Product = require('../models/product');
const { upload } = require('cloudinary').v2; // Ensure you are using the correct method for uploads
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose'); // Import mongoose if not already done

// Add a new product
const addProduct = async (req, res) => {
  try {
    // The file details are now available in req.file thanks to multer
    const imageUrl = req.file ? req.file.path : null; // Image URL from Cloudinary (if uploaded)
    const publicId = req.file ? req.file.filename : null; // Extract the public ID

    const newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      subcategories:req.body.subcategory,
      image: {
        url: imageUrl,
        public_id: publicId // Save the correct public ID
      },
      brand: req.body.brand,
      stock: req.body.stock
    });

    console.log(newProduct);
    

    await newProduct.save();
    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    console.log("products",req.params.id);
    
    const product = await Product.findById(req.params.id).populate('reviews.user');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Handle image update
    if (req.file) {
      // If a new image is uploaded, delete the old one from Cloudinary
      if (product.image.public_id) {
        await cloudinary.uploader.destroy(product.image.public_id);
      }

      // Update with new image from Cloudinary
      product.image = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }

    // Update other fields
    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.description = req.body.description || product.description;
    product.category = req.body.category || product.category;
    product.brand = req.body.brand || product.brand;
    product.stock = req.body.stock || product.stock;

    await product.save();
    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(`Deleting product with ID: ${productId}`);

    // Retrieve the product first
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log(`Product found: ${product.name}`);
    console.log(`Image public_id: ${product.image.public_id}`);

    // Delete the image from Cloudinary if it exists
    if (product.image && product.image.public_id) {
      const result = await cloudinary.uploader.destroy(product.image.public_id);
      console.log(`Cloudinary delete result: ${JSON.stringify(result)}`);
    }

    // Delete the product from the database
    await Product.findByIdAndDelete(productId);
    
    res.json({ message: 'Product and associated image removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getProductsBySubcategory = async (req, res) => {
  try {
    const  {subcategoryId}  = req.params;
    console.log("productid",subcategoryId);
    const body=req.body
    console.log(body);
    
    
    // Find products that match the subcategory
    const products = await Product.find({ subcategories: subcategoryId });
console.log(products);

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this subcategory' });
    }

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Filter products by subcategory, price, brand, and ratings

// Filter products by subcategory, price, brand, and ratings
const filterProducts = async (req, res) => {
  try {
    const { subcategoryId, minPrice, maxPrice, brand, minRating } = req.body; // Extract from body
    console.log(brand);
    
    // Create a filter object for the query
    let filter = {};
// console.log();

    // Filter by subcategory ID
    if (subcategoryId) {
      filter.subcategories = new mongoose.Types.ObjectId(subcategoryId); // Convert to ObjectId
    }
    console.log(filter.subcategories);
    


    // Filter by price range
    if (minPrice && maxPrice) {
      filter.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
      console.log('filter.price',filter.price);
      
    } else if (minPrice) {
      filter.price = { $gte: parseInt(minPrice) };
    } else if (maxPrice) {
      filter.price = { $lte: parseInt(maxPrice) };
    }

    // Filter by brand
    if (brand) {
      filter.brand = brand;
    }

    // Filter by minimum rating
    if (minRating) {
      filter.ratings = { $gte: parseFloat(minRating) };
    }

    console.log(filter);
    

    // Fetch the filtered products from the database
    const products = await Product.find(filter);
      console.log(products);
      
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error filtering products', error });
  }
};




module.exports = {
  addProduct,
  filterProducts,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsBySubcategory
};
