const mongoose = require('mongoose');

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:[true,'Username must be unique'],
        required:[true,'Username is required']
    },
    email:{
        type:String,
        unique:[true,'Email must be unique'],
        required:[true,'Email is required']
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        select:false
    
    },
    bio:String,
    profileImage:{
        type:String,
        default:'https://ik.imagekit.io/9q5a9vxr1p/download.jpg'
    
    }

})

const userModel=mongoose.model('user',userSchema);

module.exports=userModel;