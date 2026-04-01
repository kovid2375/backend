const mongoose = require("mongoose");

const postSchema= new mongoose.Schema({
    caption:{
        type:String,
        default:""
    },
    imgUrl:{
        type:String,
        required:[true,"Image Url is required"]
    },
    user:{
        ref:'user',
        type:mongoose.Schema.Types.ObjectId,
        required:[true,"User Id is required"]
    }
})

const postModel=mongoose.model('post',postSchema)
module.exports=postModel;