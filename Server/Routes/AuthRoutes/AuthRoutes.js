const express = require("express");
const { logIn } = require("../../Controllers/Auth/AuthController");
const authenticate = require("../../Middlewares/AuthMiddleware");
const Authorize = require("../../Middlewares/Authorize");
const router = express.Router();


router.post('/login',logIn);

router.get('/profile',authenticate,Authorize("client",'admin'),(req,res)=>{
    res.send('Welcome to your admin profiole');
});






module.exports = router;
