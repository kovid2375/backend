//all logic related to code will be here
const userModel = require('../models/user.model');
// const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');






async function register(req,res){
    const{email,username,password,bio,profileImage}=req.body;

    // const isUserExistByEmail= await userModel.findOne({email})

    // if(isUserExistByEmail){
    //     res.status(409).json({
    //         message:"User is already exist with this email"
    //     })
    // }
    // const isUserExistByUsername= await userModel.findOne({username})

    // if(isUserExistByUsername){
    //     res.status(409),json({
    //         message:"User is already exit with this user name "
    //     })
    // }
    // we can do this in single query using $or operator👇
    const isUserAlreadyExist= await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if(isUserAlreadyExist){
        return res.status(409).json({
            message:"user is already exist with this email or username"+ (isUserAlreadyExist.email == email?"email already exists":"username already exists")
        })
    }


    const hash = await bcrypt.hash(password,10)

    const user=await userModel.create({
        username,
        email,
        bio,
        profileImage,
        password:hash
    })

    const token=jwt.sign({
        // user ka data hona chahiye 
        // data unique hona chahiye

        id:user._id,

    },process.env.JWT_SECRET,{expiresIn:'1d'})


    res.cookie("token",token)

    res.status(201).json({
        message:"User registered successfully",
        user:{
            username:user.username,
            email:user.email,
            bio:user.bio,
            profileImage:user.profileImage
        }
    })
}

async function login(req,res){
    const {username,email,password}=req.body


    // user ==>
        //1. username ya password se login kar sakta h 
        //2. ya fir email se login kar sakta h
    
    const user = await userModel.findOne({
        $or:[
            {
                //condition 1: username se login
                username:username
            },
            {
                // condition 2: email se login
                email:email
            }
        ]
    })

    if(!user){
        return res.status(404).json({
            message:"User not Found with this email or username pls register first"
        })
    }

    const isPasswordValid= await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(401).json({
            message:"Invalid password"
        })
    }

    const token=jwt.sign(
        {
            id:user._id
        }
    ,process.env.JWT_SECRET,{expiresIn:'1d'})


    res.cookie("token",token)
    res.status(200).json({
        message:"User logged in successfully",
        user:{
            username:user.username,
            email:user.email,
            bio:user.bio,
            profileImage:user.profileImage
        }
    })
}
module.exports={
    register,
    login
}

