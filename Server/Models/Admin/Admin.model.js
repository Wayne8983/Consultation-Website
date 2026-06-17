const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
        trim:true,
        minlength:[2,'Name must be atleast 2 charcters long']
    },

    email:{
        type:String,
        required:[true,'Email is required'],
        trim:true,
        lowercase:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        unique: true
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        minlength:[8,'Password must be atleast 8 characters long']
    },
    lastLogin: {
        type: Date,
        default:null
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
{
    timestamps:true
}
);


const Admin = mongoose.model(
    'Admin',adminSchema
);

module.exports = Admin;