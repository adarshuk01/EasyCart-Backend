const Cart = require('../models/myCart');
const Product = require('../models/product');
const Order = require('../models/orders');
const mongoose = require('mongoose');


exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const shippingAddress = req.body;
    console.log('shipping', shippingAddress);

    // Retrieve the user's cart
    const cart = await Cart.findOne({ user: req.user.id }).populate('cartItems.product', 'price');

    if (!cart || cart.cartItems.length === 0) {
      return res.status(400).json({ message: 'No items in the cart' });
    }
    console.log(cart);

    // Calculate the total price and prepare orderItems from the cart
    const orderItems = cart.cartItems.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.product.price,
      name: item.product.name,
      image: item.product.image,
    }));
    console.log('orderitems', orderItems);

    // Calculate total price from the cart
    const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    console.log(itemsPrice);

    const taxPrice = req.body.taxPrice || 0;
    const shippingPrice = req.body.shippingPrice || 0;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;
    console.log('totalprice:', totalPrice);

    // Create the order
    const order = new Order({
      user: req.user.id,
      orderItems,
      shippingAddress: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
      },
      paymentMethod: req.body.paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save({ session });

    // Reduce stock for each ordered product
    for (const item of orderItems) {
      const product = await Product.findById(item.product._id).session(session);

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      product.stock -= item.quantity;
      await product.save({ session });
    }

    // Clear the user's cart after order creation
    cart.cartItems = [];
    await cart.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json(createdOrder);
  } catch (error) {
    // Abort the transaction in case of an error
    await session.abortTransaction();
    session.endSession();

    console.error(error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};


// Get order by ID
exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user ', 'name email ');

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

// Get logged-in user's orders
exports.getMyOrders = async (req, res) => {
  try {
    // Find orders for the logged-in user and populate the product details
    const orders = await Order.find({ user: req.user.id }).populate({
      path: 'orderItems.product',
      model: 'Product', // Specify the Product model explicitly
    });

    // Logging the retrieved orders (optional)
    console.log(orders);

    // Return the populated orders
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all orders (Admin only)
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'username email')
 
  res.json(orders);
};

// Get recent orders
exports.getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
      .limit(5) // Adjust limit as needed
      .populate('user', 'username');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving orders', error });
  }
};

// Cancel an order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the user is authorized to cancel the order
    if (order.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    // Update the order status to 'canceled'
    order.status = 'canceled';
    await order.save();

    res.json({ message: 'Order has been canceled successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the user is authorized to delete the order
    if (order.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this order' });
    }

    // Delete the order
    await Order.deleteOne({ _id: req.params.id });

    res.json({ message: 'Order has been deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};