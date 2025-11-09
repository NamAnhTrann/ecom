const User = require("../schema/user_schema");
const jwt = require("jsonwebtoken");
const bycrypt = require("bcrypt");

//helper functions
function generateTokens(user) {
  const accessTokens = jwt.sign(
    { id: user._id, role: user.user_role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" }
  );

  const refreshTokens = jwt.sign(
    { id: user._id, role: user.user_role },
    process.env.REFRESH_SECRET,
    { expiresIn: "30d" }
  );

  return { accessTokens, refreshTokens };
}

module.exports = {
  //signup api
  registerUser: async function (req, res) {
    try {
      const {
        user_email,
        user_password,
        user_first_name,
        user_last_name,
        user_phone_number,
        user_role,

      } = req.body;
      const existingUser = await User.findOne({ user_email });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "user already exists with that email" });
      }

      const hashedPassword = await bycrypt.hash(user_password, 10);
      const newUser = new User({
        user_email,
        user_password: hashedPassword,
        user_first_name,
        user_last_name,
        user_phone_number,
        user_role: user_role || "buyer",
      });

      await newUser.save();
      return res.status(201).json({ message: "user registered successfully" });
    } catch (error) {
      console.log("error during user registration", error);
      return res.status(500).json({ message: "Internal server error", error });
    }
  },

  //login route
  loginUser: async function (req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(400).json({ message: "No user authenticated" });
      }
     console.log(user)


      const { accessTokens, refreshTokens } = generateTokens(user);

      // Fetch full document and save refresh token
      const dbUser = await User.findById(user._id);
      dbUser.refreshTokens = refreshTokens;
      await dbUser.save();

      res.cookie("refreshTokens", refreshTokens, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({
        accessTokens,
        user: {
          id: dbUser._id,
          user_email: dbUser.user_email,
          user_first_name: dbUser.user_first_name,
          user_last_name: dbUser.user_last_name,
          user_role: dbUser.user_role,
        },
      });
      console.log("user logged in successfully:", dbUser.user_email);
    } catch (err) {
      console.error("Error during login:", err);
      res.status(500).json({ message: "Internal server error", error: err });
    }
  },

 refreshAccessToken: async function (req, res) {
  const refreshToken = req.cookies.refreshTokens;

  if (!refreshToken) {
    console.warn("[REFRESH] No token, not authenticated");
    return res
      .status(401)
      .json({ message: "Not authenticated. Please log in again." });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshTokens !== refreshToken) {
      console.warn("[REFRESH] Invalid or mismatched token for user:", decoded.id);
      return res
        .status(403)
        .json({ message: "Invalid refresh token. Please log in again." });
    }

    const newTokens = generateTokens(user);
    user.refreshTokens = newTokens.refreshTokens;
    await user.save();

    res.cookie("refreshTokens", newTokens.refreshTokens, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessTokens: newTokens.accessTokens });
  } catch (error) {
    console.error("[REFRESH ERROR]", error.message);
    return res
      .status(403)
      .json({ message: "Session expired. Please log in again." });
  }
},


  //google stuff
  //initiate google oauth
  googleAuth: (req, res, next) => {
    const passport = require("passport");
    passport.authenticate("google", { scope: ["profile", "email"] })(
      req,
      res,
      next
    );
  },

  //google callback with jwt tokens
googleAuthCallback: async (req, res) => {
  try {
    const user = req.user;
    const { accessTokens, refreshTokens } = generateTokens(user);

    user.refreshTokens = refreshTokens;
    await user.save();

    res.cookie("refreshTokens", refreshTokens, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Detect environment dynamically
    const isProd = process.env.NODE_ENV === "production";
    const baseURL = isProd
      ? "https://ecom-six-eosin.vercel.app"
      : "http://localhost:4200";

    const redirectURL = `${baseURL}/#/auth/callback?access_token=${accessTokens}&user_role=${user.user_role}`;
    res.redirect(redirectURL);
  } catch (error) {
    console.error("Error during Google OAuth callback:", error);
    res.redirect("http://localhost:4200/login?error=google");
  }
},



  //logout api
  logoutUser: async function (req, res) {
  try {
    const refreshToken = req.cookies.refreshTokens;

    // 1️ If no cookie, just return OK
    if (!refreshToken) {
      return res.status(200).json({ message: "No refresh token found — already logged out" });
    }

    // 2️ Find user by that token
    const user = await User.findOne({ refreshTokens: refreshToken });
    if (user) {
      user.refreshTokens = null;
      await user.save();
    }

    // 3️ Invalidate cookie explicitly (overwrite)
    res.cookie("refreshTokens", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
      expires: new Date(0),
      path: "/", // this is CRUCIAL
    });

    // 4️ Also clear cookie with same options just to be sure
    res.clearCookie("refreshTokens", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
    });

    console.log("[LOGOUT] Cookie + DB cleared successfully");
    return res.status(200).json({ message: "user logged out successfully" });
  } catch (err) {
    console.error("[LOGOUT ERROR]", err);
    return res.status(500).json({ message: "internal server error", error: err });
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
        new: true,
        runValidators: true,
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
