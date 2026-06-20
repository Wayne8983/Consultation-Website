const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        unique:true,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    coverImage:{
        type:String
    },
    published:{
        type:Boolean,
        default:false
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Admin"
    }
},
{
    timestamps:true
}
);

const Blog = mongoose.model(
    "Blog",blogSchema
);
module.exports = Blog; 