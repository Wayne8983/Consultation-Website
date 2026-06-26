const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    client:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Client"
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["Active","Completed","Paused","Cancelled"]
    },
    startDate:{
        type:Date,
        required:true
    },

    deadline:{
        type:Date
    },

    completedDate:{
        type:Date
    },

    budget:{
        type:Number
    },
    progress:{
        type:Number,
        default:0,
        min:0,
        max:100
    },

    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Admin"
    },

    notes:{
        type:String
    }
},
{
    timestamps:true
}
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;

