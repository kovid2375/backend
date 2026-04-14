const userModel=require('../models/user.model')
const blacklistModel=require('../models/blacklist.model')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')





async function register(req,res) {
    const {username, email,password}=req.body
    const isAlreadyRegistered=await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
        
    })
    if(isAlreadyRegistered){
        return res.status(400).json({
            message:"User already exists"

        })
    }

    const hash = await bcrypt.hash(password,10)

    const user= await userModel.create({
        username,
        email,
        password:hash
    
    })

    const token=jwt.sign({
        id:user._id,
        username:user.username

    },process.env.JWT_SECRET,{expiresIn:'1d'})
    res.cookie("token",token)

    res.status(201).json({
        message:"User registered successfully",
        user:{
            username:user.username,
            email:user.email
        }
    })
}

async function login(req,res) {
    const {username,email,password}=req.body

    const user =await userModel.findOne({
        $or:[
            {
                username:username
            },
            {
                email:email
            }
        ]
    }).select("+password")

    if(!user){
        return res.status(404).json({
            message:"User not found"
        })

    }

    const isPasswordValid = await bcrypt.compare(password,user.password)

    if(!isPasswordValid){
        return res.status(401).json({
            message:"Invalid password"
        })

    }

    const token=jwt.sign({
        id:user._id,
        username:user.username

    },process.env.JWT_SECRET,{expiresIn:'1d'})
    res.cookie("token",token)

    res.status(200).json({
        message:"user logged in successfully",
        user:{
            username:user.username,
            email:user.email
        }
    })
}

async function getme(req,res) {
    const userId=req.user.id
    const user=await userModel.findById(userId)

    res.status(200).json({
        message:"user fetched sucessfully",
        user
    })
}

async function logout(req,res) {
    const token =req.cookies.token
    res.clearCookie("token")


    await blacklistModel.create({
        token
    })
    res.status(200).json({
        message:"user logged out successfully"
    })

}

module.exports={register,login,getme,logout}


