const Cart = require('../models/myCart');
const Product = require('../models/Product'); // Ensure you import the product model

// Add item to cart
exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body; // Expect productId and quantity from the request
    const userId = req.user.id;  // Assuming user authentication

    try {
        // Check if the product ID exists in the database
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if requested quantity exceeds product stock
        if (quantity > product.stock) {
            return res.status(400).json({ message: `Only ${product.stock} items left in stock` });
        }

        // Find the cart for the current user
        let cart = await Cart.findOne({ user: userId });
        console.log(cart);
        
        
        // If no cart exists, create a new one
        if (!cart) {
            cart = new Cart({ user: userId, cartItems: [] });
        }

        // Check if the product is already in the cart
        const itemIndex = cart.cartItems.findIndex((item) => item.product.toString() === productId);

        if (itemIndex > -1) {
            // Update the quantity if the product already exists in the cart
            const newQuantity = cart.cartItems[itemIndex].quantity + quantity;

            // Ensure new quantity doesn't exceed product stock
            if (newQuantity > product.stock) {
                return res.status(400).json({ message: `Only ${product.stock} items available for this product` });
            }

            cart.cartItems[itemIndex].quantity = newQuantity;
        } else {
            // Add new product to cartItems
            cart.cartItems.push({ product: productId, quantity });
        }

        // Save the cart with the updated items
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};


exports.getCart = async (req, res) => {
    const userId = req.user.id;  // Assuming user authentication
  
    try {
      // Find the cart for the logged-in user and populate product details (name, price, image)
      const cart = await Cart.findOne({ user: userId }).populate('cartItems.product', 'name price image');
  
      // If no cart is found, return 404
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      // Initialize grand total
      let grandTotal = 0;
  
      // Iterate over cart items to calculate total price for each item and the grand total
      const updatedCartItems = cart.cartItems.map(item => {
        const productPrice = item.product.price;
        const quantity = item.quantity;
        const totalPrice = productPrice * quantity; // Calculate total price for the item
  
        // Add the total price of the item to the grand total
        grandTotal += totalPrice;
  
        // Return updated item with total price
        return {
          ...item._doc,  // Spread the existing item properties
          totalPrice,
          grandTotal // Add total price field to the item
        };
      });
  
      // Save the grand total in the cart and update the database
      cart.grandTotal = grandTotal;
      await cart.save(); // Save the updated cart with grand total
  
      // Return the updated cart along with grand total
      res.status(200).json({
        success: true,
        cartItems: updatedCartItems,  // Updated cart items with total price
        grandTotal                  // Total amount for all items in the cart
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id;

    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.cartItems = cart.cartItems.filter((item) => item.product.toString() !== productId);

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update cart item quantity
exports.updateCartItemQuantity = async (req, res) => {
    const { productId, quantity } = req.body; // Expect productId and new quantity from the request
    const userId = req.user.id;  // Assuming user authentication

    try {
        // Check if the product ID exists in the database
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the requested quantity exceeds product stock
        if (quantity > product.stock) {
            return res.status(400).json({ message: `Only ${product.stock} items available in stock` });
        }

        // Find the user's cart
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the index of the item to be updated in the cart
        const itemIndex = cart.cartItems.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            // Update the quantity of the product in the cart
            cart.cartItems[itemIndex].quantity = quantity;
        } else {
            return res.status(404).json({ message: 'Product not found in the cart' });
        }

        // Save the updated cart
        await cart.save();
        res.status(200).json(cart);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};