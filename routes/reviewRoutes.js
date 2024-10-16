const router = require('../utils/router')(); 
const { addReview, getProductReviews, deleteReview } = require('../controllers/reviewController');
const  auth  = require('../middlewares/auth');



// Add a review
router.post('/add/:productId', auth, addReview);

// Get all reviews for a product
router.get('/:productId', getProductReviews);

// Delete a review
router.delete('/:productId/reviews/:reviewId', auth, deleteReview);

module.exports = router;
