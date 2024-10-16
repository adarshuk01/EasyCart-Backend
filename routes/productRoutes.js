// routes/productRoutes.js

const router = require('../utils/router')();  // Using the helper for the router (as suggested earlier)
const { addProduct, getProducts, getProductById, updateProduct, deleteProduct ,getProductsBySubcategory,filterProducts} = require('../controllers/productController');
const upload = require('../middlewares/upload');  // Middleware to handle image uploads
const isAdmin = require('../middlewares/adminAuth');
const auth = require('../middlewares/auth');

// Route to add a new product with image upload
router.post('/add',auth,isAdmin, upload.single('image'), addProduct);

// Route to get all products
router.get('/', getProducts);

// Route to get a single product by ID
router.get('/:id', getProductById);

// Route to update an existing product (with optional image upload)
router.put('/:id',auth,isAdmin, upload.single('image'), updateProduct);

// Route to delete a product
router.delete('/:id',auth,isAdmin, deleteProduct);

router.get('/subcategory/:subcategoryId', getProductsBySubcategory);

router.post('/filter', filterProducts);


module.exports = router;
