const mongoose = require("mongoose");
const clientSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
        trim:true,
        lowercase:true,
        minlength:[2,'Name must be atleast 2 charcters long']
    },

    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        trim:true,
        lowercase:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        minlength:[8,'Password must be atleast 8 characters long']
    },

    phone:{
        type:String,
        required:[true,'Phone number is required'],
        trim:true,
        match:[/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number (e.g., +254... )']
  },
    company:{
        type:String,
        trim:true,
        default:null
    },
    status:{
        type:String,
        enum:['Pending','Active','Inactive','Suspended'],
        default:'Pending'
    },
    consultationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Consultation",
        default:null
    },
    
    lastLogin: {
        type: Date,
        default:null
    },
    mustChangePassword: {
        type: Boolean,
        default:true
    },
    isActive: {
        type: Boolean,
        default: true
    }

},
{
    timestamps:true
}
)

const Client = mongoose.model(
    'Client',clientSchema
);

module.exports = Client;