const Review = require('../models/review');
const Product = require('../models/product');


// Add a review to a product
exports.addReview = async (req, res) => {
    const  productId  = req.params.productId; // Product ID from the URL
    const { rating, comment } = req.body; // Rating and comment from the request body
    const userId = req.user.id; // Get the ID of the logged-in user (assuming you have authentication)
console.log(productId);

    try {
        // Find the product by ID
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Create a new review object
        const review = {
            user: userId,
            rating: rating,
            comment: comment,
        };

        // Add the review to the product's reviews array
        product.reviews.push(review);

        // Update the product's ratings
        product.numReviews = product.reviews.length;

        // Calculate the average rating
        product.ratings = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.numReviews;

        // Save the updated product
        await product.save();

        res.status(201).json({ message: 'Review added successfully', product });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};


// Get all reviews for a product
exports.getProductReviews = async (req, res) => {
    const { productId } = req.params;

    try {
        // Find the product by ID and populate the user field in reviews
        const product = await Product.findById(productId).populate('reviews.user', 'username');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Return the reviews
        res.status(200).json(product.reviews);
    } catch (error) {
        console.error('Error retrieving reviews:', error);
        res.status(500).json({ message: 'Error retrieving reviews', error });
    }
};

// Delete a review
exports.deleteReview = async (req, res) => {
    const { productId, reviewId } = req.params;

    try {
        // Find the product by ID
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find the review in the product's reviews array
        const reviewIndex = product.reviews.findIndex(r => r._id.toString() === reviewId);

        if (reviewIndex === -1) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Remove the review from the product's reviews array
        product.reviews.splice(reviewIndex, 1);
        product.numReviews = product.reviews.length;

        // Update ratings if there are remaining reviews
        product.ratings = product.numReviews > 0 
            ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.numReviews
            : 0;

        // Save the updated product
        await product.save();

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: 'Error deleting review', error });
    }
};

