// models/User.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Minimum password length
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        street: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        state: {
            type: String,
            trim: true,
        },
        zip: {
            type: String,
            trim: true,
        },
    },
    phone: {
        type: String,
        trim: true,
    },
    isAdmin: {
        type: Boolean,
        default: false, // Default role is user, set to true for admin
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Middleware to update `updatedAt` on each save
userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
