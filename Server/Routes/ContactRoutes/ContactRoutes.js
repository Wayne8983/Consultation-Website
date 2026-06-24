const express = require("express");
const { 
    contactMessage, 
    allContactMessages } = require("../../Controllers/ContactController/ContactController");
const authenticate = require("../../Middlewares/AuthMiddleware");
const Authorize = require("../../Middlewares/Authorize");

const router = express.Router();


router.post('/contactMessage',contactMessage);
router.get('/allMessages',authenticate,Authorize("admin"),allContactMessages);


module.exports = router;