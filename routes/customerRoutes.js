const router = require('../utils/router')(); 
const customerController = require('../controllers/customerController');
const auth = require('../middlewares/auth'); // Middleware for authentication

// Get all customer
router.get('/', customerController.getAllCustomers);

// Delete customer
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;