const Product = require("../schema/products_schema");

module.exports = {
  //below are business logic operations apis

  //add products
  addProduct: async function (req, res) {
    try {
      const newProduct = new Product({
        ...req.body,
      });

      await newProduct.save();

      return res.status(200).json(newProduct);
    } catch (err) {
      return res.status(500).json({ message: "Internal error", err });
    }
  },

  //delete all products
  deleteAllProduct: async function (req, res) {
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
    const productId = req.params.id;
    try {
      const deleteProduct = await Product.findByIdAndDelete(productId);
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
    const productId = req.params.id;
    try {
      const updateProduct = await Product.findByIdAndUpdate(productId);
      if (!updateProduct) {
        console.log("cannot update this product id", productId);
        return res
          .status(400)
          .json({ message: "error updating product", productId });
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
      const products = await Product.find({});
      console.log(products);

      if (!products) {
        return res
          .status(400)
          .json({ message: "cannot list product", products });
      } else {
        return res.status(200).json(products);
      }
    } catch (err) {
      return res.status(500).json({ message: "internal error" }, err);
    }
  },

  listSingleProduct: async function (req, res) {
    const productId = req.params.id;
    try {
      const product = await Product.findById(productId);
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
