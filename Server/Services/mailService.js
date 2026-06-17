const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.user_email,
        pass:process.env.Gmail_Password
    },
});

 const sendEmail = async({to,subject,text,html})=>{
    return transporter.sendMail({
        from:process.env.user_email,
        to,
        subject,
        text,
        html

    })
}


module.exports =sendEmail;