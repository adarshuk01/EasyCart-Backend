const  isAdmin  = require('../middlewares/adminAuth');
const auth = require('../middlewares/auth');
const router = require('../utils/router')();
const { createCategory,getAllCategories ,getCategoryById,deleteCategory } = require('../controllers/categoryController');


router.post('/',auth,isAdmin, createCategory);
router.get('/',getAllCategories)
router.delete('/',auth,isAdmin,deleteCategory)

module.exports = router;