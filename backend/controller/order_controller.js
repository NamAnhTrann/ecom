const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Cart = require("../schema/cart_schema");
const Order = require("../schema/order_schema");

module.exports = {
  create_order: async function (req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(404).json({ message: "User not authenticated" });
      }

      const cart = await Cart.findOne({ user_id: user._id }).populate(
        "items.product_id"
      );
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty!" });
      }

      // heck if an existing pending order already exists for this user
      let existingOrder = await Order.findOne({
        user_id: user._id,
        order_status: "pending",
      });

      if (existingOrder) {
        // Update the existing order with current cart contents
        existingOrder.order_items = cart.items.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
          price_at_purchase: i.product_id.product_price,
        }));
        existingOrder.total_amount = cart.total_price;
        await existingOrder.save();

        return res.status(200).json({
          message: "Existing pending order reused",
          order: existingOrder,
        });
      }

      //Otherwise, create a new order
      const newOrder = await Order.create({
        user_id: user._id,
        cart_id: cart._id,
        order_items: cart.items.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
          price_at_purchase: i.product_id.product_price,
        })),
        total_amount: cart.total_price,
      });

      return res.status(201).json({
        message: "New order created",
        order: newOrder,
      });
    } catch (err) {
      console.error("Error creating order:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  listSingleOrder: async function (req, res) {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "User is not authenticated" });
      }

      const order = await Order.findOne({ user_id: user._id })
        .sort({ createdAt: -1, _id: -1 })  // sort the earliest order
        .populate("order_items.product_id")
        .populate("user_id", "user_first_name user_last_name user_email");
;
      if (!order) {
        console.log("Error fetching order", order);
        return res
          .status(401)
          .json({ message: "Order is not available", order });
      } else {
        return res.status(200).json({ message: "Order fetched", order });
      }
    } catch (err) {
      return res.status(500).json({ error: "Internal server error", err });
    }
  },

  create_checkout_session: async function (req, res) {
    try {
      const user = req.user;
      const { order_id } = req.body;

      const order = await Order.findById(order_id).populate(
        "order_items.product_id"
      );
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      const line_items = order.order_items.map((item) => ({
        price_data: {
          currency: "aud",
          product_data: {
            name: item.product_id.product_title,
          },
          unit_amount: item.price_at_purchase * 100,
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items,
        customer_email: user.user_email,
        metadata: {
          order_id: order._id.toString(),
        },

        //remember to update when prod
        success_url: "http://localhost:4200/order-summary-page",
        cancel_url: "http://localhost:4200/marketplace-page",
      });
      return res.json({ url: session.url });
    } catch (err) {
      console.error("Error creating checkout session:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
