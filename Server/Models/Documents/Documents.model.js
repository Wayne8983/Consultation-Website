const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
    client:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Client",
        required:true
    },
    title:{
        type:String,
        required:[true,'A documents title is required'],
        trim:true
    },
    content:{
        type:String
    },
    fileUrl:{
        type:String,
        required:true
    },
    uploadedby:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }

},
{
    timestamps:true
}
)

const Documents = mongoose.model(
    "Documents",documentSchema
);

module.exports = Documents;