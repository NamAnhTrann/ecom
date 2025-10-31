const Like = require("../schema/like_schema");
const Product = require("../schema/products_schema");
const Comment = require("../schema/comment_schema");

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

      // check if this user already liked
      const existingLike = await Like.findOne({
        user_id: user.id,
        product_id: productId,
      });

      if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id });
        await Product.findByIdAndUpdate(productId, {
          $inc: { likes_count: -1 },
        });
        return res.status(200).json({
          liked: false,
          message: "product unliked successfully",
        });
      }

      // create new like
      await Like.create({
        user_id: user.id,
        product_id: productId,
      });

      await Product.findByIdAndUpdate(productId, { $inc: { likes_count: 1 } });

      return res.status(200).json({
        liked: true,
        message: "product liked",
        user: user, // return user info so you can also see it in frontend
      });
    } catch (err) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: err.message,
      });
    }
  },

  //adding comments

  addComment: async function (req, res) {
    try {
      const user = req.user;

      if (!user) {
        return res.status(400).json({ message: "Not authenticated", user });
      }
      const product_id = req.params.id;
      if (!product_id) {
        return res
          .status(400)
          .json({ message: "No product found", product_id });
      }

      const { text } = req.body;

      const newComment = await Comment.create({
        user_id: user._id,
        product_id,
        text: text.trim(),
      });

      const populatedComment = await newComment.populate(
        "user_id",
        "user_first_name user_last_name user_email user_profile_img"
      );

      await Product.findByIdAndUpdate(product_id, {
        $inc: {
          comments_count: 1,
        },
      });

      return res.status(201).json(populatedComment);
    } catch (err) {
      return res.status(500).json({ message: "error adding comments", err });
    }
  },

  listComment: async function (req, res) {
    try {
      const product_id = req.params.id;

      const comments = await Comment.find({ product_id })
        .populate({
          path: "user_id",
          select: "user_first_name user_last_name user_profile_img user_email",
        })
        .sort({
          createdAt: -1, //earliest comment appear first
        });

      return res
        .status(200)
        .json({ message: "Comment added", count: comments.length, comments });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "error adding comments", error: err.message });
    }
  },
};
