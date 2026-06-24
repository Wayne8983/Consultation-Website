const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
    client:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Client",
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    meetingDate:{
        type:Date,
        required:true
    },
    venue:{
        type:String,
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Admin"
    },
    status:{
        type:String,
        enum:["Scheduled","Completed","Cancelled"],
        default:"Scheduled"        
    }

},
{
    timestamps:true
}
)

const Meeting = mongoose.model(
    "meeting",meetingSchema
);

module.exports = Meeting;