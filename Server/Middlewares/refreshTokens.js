const jwt = require("jsonwebtoken");

const generateNewAccessToken = async(req,res)=>{
    try{
        const token = req.user?.token;
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Unauthorized.No token provided!"
            });
        }

        const decode = jwt.verify(token,ACCESS_TOKEN_SECRET);
        




    }catch(err){
        console.log('error in generating new refresh token',err);
        return res.status(500).json({
            success:false,
            message:"Internal error in generating new access token.Please login again to continue"
        });
    }
}