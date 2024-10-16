// models/Cart.js

const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Referencing the User model
        required: true,
    },
    cartItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',  // Referencing the Product model
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,  // Each product must have at least 1 quantity
                default: 1,
            },
        },
    ],
    grandTotal:{
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Cart', cartSchema);
