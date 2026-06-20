const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Your name is required']
    },
    email:{
        type:String,
        required:[true,'Email is required']
    },
    message:{
        type:String,
        required:[true,'Please provide a brief message']
    },
    read:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
}
)

const Contact = mongoose.model(
    "Contact",ContactSchema
);
module.exports = Contact;