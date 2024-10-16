// routes/cartRoutes.js

const router = require('../utils/router')(); 
const { addToCart, getCart, removeFromCart, updateCartItemQuantity } = require('../controllers/cartController');
const auth = require('../middlewares/auth');  // Protect routes with user authentication



// Route to add item to cart
router.post('/', auth, addToCart);

// Route to get the user's cart
router.get('/', auth, getCart);

// Route to remove item from cart
router.delete('/', auth, removeFromCart);

router.put('/', auth, updateCartItemQuantity);


module.exports = router;
