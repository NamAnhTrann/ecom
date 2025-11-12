const express = require("express");
const passport = require("passport");

const auth = require("../middleware/auth")
const userController = require("../controller/user_controller");
// const { verifyToken } = require("../middleware/auth");
// const { authorizeRoles } = require("../middleware/authorizeRole");

const router = express.Router();

// Local register and login
router.post("/register", userController.registerUser);
router.post("/login", passport.authenticate("local", { session: false }), userController.loginUser);

// Google OAuth
router.get("/auth/google", userController.googleAuth);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  userController.googleAuthCallback
);

// Refresh + Logout
router.get("/refresh", userController.refreshAccessToken);
router.post("/logout", userController.logoutUser);

//reset passwords
router.post("/send/reset/password/api/", userController.sendRequestPassword);
router.get("/reset/password/verify/:token", userController.verifyToken);
router.post("/reset/password/:token", userController.resetPassword);



module.exports = router;
