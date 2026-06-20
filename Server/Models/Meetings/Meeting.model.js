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
        type:String,
        required:true
    },
    meetingDate:{
        type:Date,
        require:true
    },
    venue:{
        type:String,
        required:true
    },
    status:{
        enum:["Scheduled","Completed","Cancelled"],
        default:"Scheduled"        
    }

},
{
    timestamps:true
}
)

const meeting = mongoose.model(
    "meeting",meetingSchema
);

module.exports = meeting;