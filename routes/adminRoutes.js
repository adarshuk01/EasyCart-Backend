const router = require('../utils/router')(); 
const adminController = require('../controllers/adminController');
const isAdmin = require('../middlewares/auth');
const auth = require('../middlewares/auth');


// Admin registration
router.post('/register', adminController.registerAdmin);

// Admin login
router.post('/login', adminController.loginAdmin);
router.get('/stats', adminController.getDashboardStats);

// Protected admin route example
// router.get('/users', isAdmin, adminController.getAllUsers); // Get all users (protected)

module.exports = router;