// Auth controller logic
import userModel from "../models/user.model.js"

import jwt from "jsonwebtoken"

async function sendTokenResponse(user,res) {
    const token =jwt.sign({
        id:user._id
    },process.env.JWT_SECRET,{
        expiresIn:"1h"
    })

    res.cookie("token",token)

    res.status(200).json({
        
        success:true,
        user:{
            id:user._id,
            email:user.email,
            contact:user.contact,
            fullName:user.fullName,
            role:user.role
        }
    })
}

export const register = async (req,res)=>{
    const {fullName,email,password,contact,isSeller} = req.body;

    try {
        const existingUser=await userModel.findOne({
            $or:[
                {email},
                {contact}
            ]
        })
        if(existingUser){
            return res.status(400).json({success:false,message:"User already exists"})
        }


    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
    const user =await userModel.create({
        fullName,
        email,
        password,
        contact,
        role:isSeller?"seller":"buyer"
    })
    await sendTokenResponse(user,res,"User registered successfully")
    


    
}


export const login = async(req,res)=>{
    
    const {email,password}=req.body
    try {
        const user=await userModel.findOne({email})
        if(!user){
            return res.status(400).json({success:false,message:"User not found"})
        }
        const isPasswordValid=await user.comparePassword(password)
        if(!isPasswordValid){
            return res.status(400).json({success:false,message:"Invalid password"})
        }
        await sendTokenResponse(user,res,"User logged in successfully")
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}


export const googleCallback=async (req,res)=>{
    
}