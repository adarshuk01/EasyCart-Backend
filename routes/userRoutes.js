// routes/userRoutes.js

const router = require('../utils/router')(); 
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth'); // Middleware for authentication

// Register a new user
router.post('/register', userController.registerUser);

// User login
router.post('/login', userController.loginUser);

// Get user profile (protected route)
router.get('/profile', auth, userController.getUserProfile);

// Update user information (protected route)
router.put('/update', auth, userController.updateUser);

module.exports = router;
