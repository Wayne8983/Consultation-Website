const express = require("express");
const authenticate = require("../../Middlewares/AuthMiddleware");
const Authorize = require("../../Middlewares/Authorize");
const { changePassword } = require("../../Controllers/ClientControllers/clientController");
const router = express.Router();

router.patch('/changePassword/:id',authenticate,Authorize("client"),changePassword);




module.exports = router