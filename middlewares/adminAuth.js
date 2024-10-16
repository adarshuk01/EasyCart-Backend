// middleware/adminMiddleware.js

const User = require('../models/user');

const isAdmin = async (req, res, next) => {
    const userId = req.user.id; // Assuming you decode the token and have user info in req.user
console.log("admin",userId);

    const user = await User.findById(userId);
    if (!user || !user.isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

module.exports = isAdmin;