const Product = require("../schema/products_schema");
const Like = require("../schema/like_schema");

module.exports = {
  //below are business logic operations apis

  //add products
  addProduct: async function (req, res) {
    try {
      const {
        product_title,
        product_price,
        product_desc,
        product_quantity,
        product_img,
      } = req.body;

      const user = req.user;
      if (!user) {
        console.log("No user found in req.user");
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (user.user_role !== "seller") {
        console.log("Unauthorized role:", user.user_role);
        return res
          .status(403)
          .json({ message: "Only sellers can add products" });
      }

      const product = new Product({
        product_title,
        product_price,
        product_desc,
        product_quantity,
        product_img,
        user_id: user.id,
      });

      const newProduct = await product.save();
      return res.status(201).json({
        message: "Product added successfully",
        product: newProduct,
      });
    } catch (err) {
      console.error("Error adding product:", err);
      return res
        .status(500)
        .json({ message: "Internal error", error: err.message });
    }
  },

  //delete all products
  deleteAllProduct: async function (req, res) {
    const user = req.user;
    if (!user) {
      return res.status(500).json({ message: "user is not authenticated" });
    }

    if (user.user_role !== "seller") {
      return res.status(500).json({ message: "User is not seller" });
    }

    try {
      const products = await Product.deleteMany({});
      return res.status(200).json({
        messaege: "all products are deleted",
        deletedCount: products.deletedCount,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "internal apis errors on delete" });
    }
  },

  //delete single chosen product based on params id
  deleteSingleProduct: async function (req, res) {
    const product_id = req.params.id;
    const user = req.user;

    //check if user is logged in
    if (!user) {
      return res
        .status(401)
        .json({ message: "user is not authenticated", user });
    }

    //check if user role is a seller
    if (user.user_role !== "seller") {
      return res
        .status(401)
        .json({ message: "user is not a seller, thus cannot sell" });
    }

    try {
      //check if this product belong to "this seller"
      const product = await Product.findById(product_id);

      if (product.user_id.toString() !== user.id) {
        return res
          .status(500)
          .json({
            message: "you cannot delete a product that doesn't belong to you",
          });
      }

      const deleteProduct = await Product.findByIdAndDelete(product_id);
      return res.status(200).json({
        message: "product has been deleted",
        deleteProduct,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "internal single deletion erorr", err });
    }
  },

  //update single product details
  updateSingleProduct: async function (req, res) {
    const product_id = req.params.id;
    const productData = req.body;
    const user = req.user;

    if (!user) {
      return res.status(500).json({ message: "User is not authenticated" });
    }

    if (user.user_role !== "seller") {
      return res.status(500).json({ message: "User is not selller" });
    }
    try {
      //find product_id and do a quick check if that product belong to this specific user
      const product = await Product.findById(product_id);

      if (product.user_id.toString() !== user.id) {
        return res
          .status(500)
          .json({
            message: "you cannot update a product that doesn't belong to you",
          });
      }

      const updateProduct = await Product.findByIdAndUpdate(
        product_id,
        productData,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!updateProduct) {
        console.log("cannot update this product id", product_id);
        return res
          .status(400)
          .json({ message: "error updating product", product_id });
      } else {
        return res
          .status(200)
          .json({ message: "product is updated", updateProduct });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: "internal single update erorr", err });
    }
  },

  //TODO - may require BATCH update for products, TBD

  //belows are internal user facing REST APIs
  listAllProduct: async function (req, res) {
    try {
      const user = req.user;
      const userId = user ? user.id : null;

      const products = await Product.find({})
        .populate({
          path: "user_id",
          select:
            "user_first_name user_last_name user_profile_img user_email user_role",
          match: { user_role: "seller" },
        })
        .lean();
      const filteredProducts = products.filter((p) => p.user_id !== null);

      if (!filteredProducts.length) {
        return res.status(404).json({ message: "No products found" });
      }

      if (userId) {
        const likedProducts = await Like.find({ user_id: userId }).select(
          "product_id"
        );

        const likedProductIds = new Set(
          likedProducts.map((like) => like.product_id.toString())
        );

        filteredProducts.forEach((product) => {
          product.liked = likedProductIds.has(product._id.toString());
        });
      } else {
        filteredProducts.forEach((product) => (product.liked = false));
      }

      return res.status(200).json(filteredProducts);
    } catch (err) {
      console.error("Error listing products:", err);
      return res
        .status(500)
        .json({ message: "Internal server error", error: err.message });
    }
  },

  listSingleProduct: async function (req, res) {
    const user = req.user;
    if(!user){
      return res.status(401).json({message:"user is not authenticated"});
    }
    const product_id = req.params.id;
    if(!product_id){
      return res.status(401).json({message:"Product cannot be found"}); 
    }
    try {
      const product = await Product.findById(product_id)
        .populate({
          path: "user_id",
          select: "user_first_name user_last_name user_profile_img user_role",
        })
        .exec();

      if (!product) {
        console.log(product);
        return res
          .status(400)
          .json({ message: "cannot find that product id", product });
      } else {
        return res.status(200).json(product);
      }
    } catch (err) {
      return res.status(500).json({ message: "internal error" }, err);
    }
  },
};
