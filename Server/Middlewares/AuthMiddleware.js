const jwt = require("jsonwebtoken");

const authenticate = (req,res,next)=>{
    try{
    const AuthHeader = req.headers?.authorization ;
    if(!AuthHeader || !AuthHeader.startsWith("Bearer ")){
        return res.status(401).json({
            success:false,
            message:"Access denied.No valid token provided!"
        })
    }

    const token = AuthHeader.split(" ")[1];

    const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    req.user=decoded;
    next();


    }catch(err){

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token has expired." });
    }
    
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token." });
    }

    // Fallback for actual server errors
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication."
    });
  }
};



module.exports = authenticate;