const bcrypt = require("bcrypt");

const HashPassword = (p)=>{
    return bcrypt.hash(p,10);
}

const ConfirmHash = (p,h)=>{
    return bcrypt.compare(p,h);
}



module.exports = {ConfirmHash,HashPassword}