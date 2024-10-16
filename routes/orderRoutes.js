const router = require('../utils/router')(); 
const { createOrder, getOrderById, getMyOrders, getAllOrders,getRecentOrders,cancelOrder,deleteOrder } = require('../controllers/orderController');
const  isAdmin  = require('../middlewares/adminAuth');
const auth = require('../middlewares/auth');

// Create a new order
router.post('/', auth, createOrder);

// Get logged-in user's orders
router.get('/myorders', auth, getMyOrders);


// Get all orders (Admin only)
router.get('/', auth, isAdmin, getAllOrders);

// GET /api/orders/recent
router.get('/recent',auth,isAdmin, getRecentOrders);

// Get order by ID
router.get('/:id', auth, getOrderById);

// Cancel order route
router.put('/:id/cancel',auth,cancelOrder)

// Delete order route
router.delete('/:id', auth ,deleteOrder)


module.exports = router;
