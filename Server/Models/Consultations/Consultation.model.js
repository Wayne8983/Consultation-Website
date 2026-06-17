const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema({
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
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
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

    projectType:{
        type:String,
        required:[true,'Please select a valid Project Type']
      
    },

    description:{
        type:String,
        required:[true,'Project Description is required'],
        maxlength : [1000,'Description cannot exceed 1000 characters'],
        trim : true
    },

    preferredContactMethod:{
        type:String,
        required : [true,'Please provide desireable contact Method'],
        enum : {
            values : ['email','phone','whatsapp','any'],
        }
    },

    status:{
        type:String,
        enum: {
            values:['Pending','Approved','Rejected']
        },
        default:'Pending'
    },

    reviewedAt:{
        type:Date,
        default:null
    }

    },


{
    timestamps:{
        createdAt:true,
        updatedAt:true
    }
}
)

const Consultation = mongoose.model(
    'Consultation',consultationSchema
);


 module.exports = Consultation;