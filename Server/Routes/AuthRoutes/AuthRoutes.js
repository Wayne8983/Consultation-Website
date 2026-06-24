const express = require("express");
const { logIn } = require("../../Controllers/Auth/AuthController");
const authenticate = require("../../Middlewares/AuthMiddleware");
const Authorize = require("../../Middlewares/Authorize");
const router = express.Router();


router.post('/login',logIn);







module.exports = router;
