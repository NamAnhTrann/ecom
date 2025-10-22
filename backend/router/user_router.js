const express = require("express");
const passport = require("passport");
const userController = require("../controller/user_controller");
// const { verifyToken } = require("../middleware/auth");
// const { authorizeRoles } = require("../middleware/authorizeRole");

const router = express.Router();

// Local register and login
router.post("/register", userController.registerUser);
router.post("/login", passport.authenticate("local", { session: false }), userController.loginUser);

// Google OAuth
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/auth/google/callback", passport.authenticate("google", { session: false }), userController.loginUser);

// Refresh + Logout
router.get("/refresh", userController.refreshAccessToken);
router.post("/logout", userController.logoutUser);



module.exports = router;
