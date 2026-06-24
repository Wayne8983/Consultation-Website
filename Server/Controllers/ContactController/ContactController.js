const Contact = require("../../Models/ContactMessage/ContactMessage");

const contactMessage = async(req,res) =>{
    try{
        const { name,email,message }= req.body;
        if(!name || !email || !message){
            return res.status(400).json({
                success:false,
                message:"All fields required"
            });
        }
        await Contact.create({
            name,
            email,
            message
        });

        return res.status(201).json({
            success:true,
            message:"Contact message sent successfully"
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal Server error.Please try again later"
        })
    }
}

const allContactMessages = async(req,res) =>{
    try{
        const allMessages = await Contact.find({});


        return res.status(200).json({
            success:true,
            allMessages
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal server error please try again later"
        })
    }
}




module.exports = {contactMessage,allContactMessages};