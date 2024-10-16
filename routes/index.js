const express = require('express');
const productRoutes = require('./productRoutes');
const userRoutes = require('./userRoutes');  // Another route file example
const adminRoutes=require('./adminRoutes')
const orderRoutes=require('./orderRoutes')
const cartRoutes=require('./cartRoutes')
const reviewRoutes=require('./reviewRoutes')
const customerRoutes=require('./customerRoutes')
const categoryRoutes=require('./categoryRoutes')
const  isAdmin  = require('../middlewares/adminAuth');
const auth = require('../middlewares/auth');

const router = express.Router();

// Add all routes
router.use('/products', productRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/order', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/review', reviewRoutes);
router.use('/customer',auth,isAdmin, customerRoutes);
router.use('/categories',categoryRoutes)


module.exports = router;