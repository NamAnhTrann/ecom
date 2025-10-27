const Like = require("../schema/like_schema");
const Product = require("../schema/products_schema");

module.exports = {
  toggleLike: async function (req, res) {
    try {
      const user = req.user;

      const productId = req.params.id;

      if (!user) {
        return res
          .status(401)
          .json({ message: "User not authenticated", user });
      }

      //check if this user already liked
      const existingLike = await Like.findOne({
        user_id: user.id,
        product_id: productId,
      });

      if (existingLike) {
        //then we can unlike if we want by re-triggering
        await Like.deleteOne({
          _id: existingLike._id,
        });
        await Product.findByIdAndUpdate(productId, {
          $inc: { likes_count: -1 },
        });
        return res.status(200).json({
          liked: false,
          message: "product unliked successfully",
        });
      }

      //we can make a new like
      await Like.create({
        user_id: user.id,
        product_id: productId,
      });

      await Product.findByIdAndUpdate(productId, {
        $inc: {
          likes_count: 1,
        },
      });

      return res.status(200).json({
        liked: true,
        message: "product liked",
      });
    } catch (err) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: err.message,
      });
    }
  },
};
