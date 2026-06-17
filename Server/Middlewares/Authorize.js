const Authorize =(...role)=>{
    return (req,res,next)=>{
        if(role.includes(req.user.userType)){
            return next();
        }
        return res.sendStatus(403);
    }
    
}

module.exports = Authorize;