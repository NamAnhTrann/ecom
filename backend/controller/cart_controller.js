const Cart = require("../schema/cart_schema");
const Product = require("../schema/products_schema");
const User = require("../schema/user_schema");

module.exports = {
  add_cart_api: async function (req, res) {
    try {
      let user = req.user;
      const { product_id, quantity } = req.body;

      //find product
      const product = await Product.findById(product_id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      //find or create user carts
      let cart = await Cart.findOne({ user_id: user._id });
      if (!cart) {
        cart = new Cart({
          user_id: user._id,
          items: [],
          total_price: 0,
        });
      }
      const existing_item = cart.items.find(
        (item) => item.product_id.toString() === product_id
      );

      if (existing_item) {
        existing_item.quantity += quantity;
      } else {
        cart.items.push({
          product_id,
          quantity,
        });
      }

      //total price
      let total = 0;
      for (const item of cart.items) {
        const prod = await Product.findById(item.product_id);
        total += prod.product_price * item.quantity; //use quantity if goes wrong
      }

      cart.total_price = total;
      cart.updatedAt = new Date();

      await cart.save();

      //Populate product details for frontend
      const populatedCart = await Cart.findById(cart._id).populate(
        "items.product_id",
        "product_title product_price product_img"
      );

      return res.status(200).json({
        message: "Product added to cart successfully",
        cart: populatedCart,
      });
    } catch (err) {
      console.error("Add to cart error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  //list cart
  list_cart: async function (req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "user is not authenticated" });
      }

      // Find user's cart
      const cart = await Cart.findOne({ user_id: user._id }).populate(
        "items.product_id",
        "product_title product_price product_img"
      );

      if (!cart) {
        return res.status(404).json({ message: "cart is not available" });
      }

      return res.status(200).json({
        message: "Cart fetched successfully",
        cart,
      });
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  deletePerItemInCart: async function (req, res) {
    try {
      const user = req.user;
      const { product_id } = req.params;

      if (!user) {
        return res.status(401).json({ message: "not authenticated" });
      }

      if (!product_id) {
        return res.status(400).json({ message: "Missing product_id" });
      }

      const cart = await Cart.findOne({ user_id: user._id });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const itemIndex = cart.items.findIndex(
      (item) => item.product_id.toString() === product_id
    );

      if (itemIndex === -1) {
        return res.status(404).json({ message: "Item not found in cart" });
      }

      cart.items.splice(itemIndex, 1);

      // Recalculate total
      let total = 0;
      for (const item of cart.items) {
        const prod = await Product.findById(item.product_id);
        total += prod.product_price * item.quantity;
      }
      cart.total_price = total;
      cart.updatedAt = new Date();

      await cart.save();

      const updatedCart = await Cart.findById(cart._id).populate(
        "items.product_id",
        "product_title product_price product_img"
      );

      res.status(200).json({
        message: "Item removed successfully",
        cart: updatedCart,
      });
    } catch (err) {
      console.error("Delete item from cart error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
