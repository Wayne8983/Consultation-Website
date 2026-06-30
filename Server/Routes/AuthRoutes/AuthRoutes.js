const express = require("express");

const {
  logIn,
  refreshToken,
  logout,
} = require("../../Controllers/Auth/AuthController");

const authenticate = require("../../Middlewares/AuthMiddleware");

const router = express.Router();

router.post("/login", logIn);
router.post("/refresh-token", refreshToken);
router.post("/logout", authenticate, logout);

module.exports = router;