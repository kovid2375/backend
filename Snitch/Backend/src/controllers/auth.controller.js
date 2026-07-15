// Auth controller logic
import userModel from "../models/user.model"

import jwt from "jsonwebtoken"

async function sendTokenResponse(user,res) {
    const token =jwt.sign({
        id:user._id
    },process.env.JWT_SECRET,{
        expiresIn:"1h"
    })
}

export const register = async (req,res)=>{
    const {fullName,email,password,contact} = req.body;

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
        contact
    })
    return res.status(201).json({success:true,message:"User registered successfully",user})



    
}