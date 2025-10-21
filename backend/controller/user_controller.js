const User = require("../schema/user_schema");

module.exports = {
  //user signup
  createUser: async function (req, res) {
    try {
      //TODO
    } catch (err) {
      return res.status(500).json({ message: "Internal server error", err });
    }
  },
  //this can be use to list all users on the marketplace if they were to
  //display products from specific users
  getAllUsers: async function (req, res) {
    try {
      const users = await User.find({});
      if (!users) {
        return res.status(400).json({ message: "cannot fetch users", users });
      }
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  },

  getSingleUser: async function (req, res) {
    const user_id = req.params.id;
    try {
      const user = await User.findById(user_id);
      if (!user) {
        return res
          .status(400)
          .json({ message: "cannot fetch that user", user_id });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  },

  //user operations
  //delete users
  deleteAllUser: async function (req, res) {
    try {
      const users = await User.deleteMany({});
      if (!users) {
        return res.status(400).json({ message: "cannot delete users" });
      }
      return res.status(200).json({
        message: "all users are deleted",
        deletedCount: users.deletedCount,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "internal apis errors on delete" });
    }
  },

  //delete single user, this route can be use by user too to delete themselve or deactivate their account
  deleteSingleUser: async function (req, res) {
    const user_id = req.params.id;
    try {
      const deleted_user = await User.findByIdAndDelete(user_id);
      if (!deleted_user) {
        return res
          .status(400)
          .json({ message: "cannot delete that user", user_id });
      }
      return res
        .status(200)
        .json({ message: "user deleted successfully", user_id });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  },

  //update users details
  updateSingleUserDetails: async function (req, res) {
    const user_id = req.params.id;
    const userData = req.body;
    try {
      const updated_user = await User.findByIdAndUpdate(user_id, userData, {
        new: true, runValidators: true
      });
      if (!updated_user) {
        return res
          .status(400)
          .json({ message: "cannot update that user", user_id });
      }
      return res
        .status(200)
        .json({ message: "user updated successfully", updated_user });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  },
};
