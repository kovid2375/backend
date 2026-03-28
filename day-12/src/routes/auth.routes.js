const express = require('express')

const jwt = require('jsonwebtoken')

const authRouter = express.Router()
const userModel=require("../models/user.model")

authRouter.post("/register",async(req,res)=>{
    const {name,email,password}=req.body

    const isUserAlreadyExits= await userModel.findOne({email})

    if(isUserAlreadyExits){
        return res.status(400).json({
            message:"user already exists"
        })
    }






     const user=await userModel.create({
        name,email,password

    })

    const token=jwt.sign({
        id:user._id,
        email:user.email
    },process.env.JWT_SECRET)


    res.cookie("jwt_token",token)



    res.status(201).json({
        message:"user created successfully",
        user,token
    })
})

module.exports = authRouter