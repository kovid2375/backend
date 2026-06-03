const userModel=require('../models/user.model')
const blacklistModel=require('../models/blacklist.model')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const redis=require('../config/cache')





async function register(req,res) {
    try {
        const username = req.body.username?.trim()
        const email = req.body.email?.trim().toLowerCase()
        const password = req.body.password

        if(!username || !email || !password){
            return res.status(400).json({
                message:"Username, email and password are required"
            })
        }

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
    } catch(error) {
        console.error("Registration error:", error)
        res.status(500).json({
            message:"Error registering user",
            error: error.message
        })
    }
}

async function login(req,res) {
    try {
        const username = req.body.username?.trim()
        const email = req.body.email?.trim().toLowerCase()
        const password = req.body.password

        if(!email && !username || !password){
            return res.status(400).json({
                message:"Email/username and password are required"
            })
        }

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
    } catch(error) {
        console.error("Login error:", error)
        res.status(500).json({
            message:"Error logging in",
            error: error.message
        })
    }
}

async function getme(req,res) {
    try {
        const userId=req.user.id
        const user=await userModel.findById(userId)

        res.status(200).json({
            message:"user fetched sucessfully",
            user
        })
    } catch(error) {
        console.error("Get me error:", error)
        res.status(500).json({
            message:"Error fetching user",
            error: error.message
        })
    }
}

async function logout(req,res) {
    try {
        const token =req.cookies.token
        res.clearCookie("token")

        await redis.set(token,Date.now().toString(),"EX",60*60)
        res.status(200).json({
            message:"user logged out successfully"
        })
    } catch(error) {
        console.error("Logout error:", error)
        res.status(500).json({
            message:"Error logging out",
            error: error.message
        })
    }
}

/**
 * @redis
 * key value 
 * js object 
 * {
 * username:"test",
 * email:"test@test.com"
 * }
 */

module.exports={register,login,getme,logout}

