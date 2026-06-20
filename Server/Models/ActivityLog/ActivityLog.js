const mongoose = require("mongoose");

const activityLogs = new mongoose.Schema({
    action:{
        type:String,
        required:true
    },
    performedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Admin",
        required:true
    },
    details:{
        type:String
    }
},
{
    timestamps:true
}
);

const activity = mongoose.model(
    "activity",activityLogs
);

module.exports = activity;