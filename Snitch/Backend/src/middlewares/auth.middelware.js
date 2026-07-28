import jwt from "jsonwebtoken"
import userModel from '../models/user.model.js'



export const authenticateSeller=async(req,res,next)=>{
    try{
        const token=req.cookies.token;
        if(!token){
            return res.status(401).json({message:"Unauthorized"})
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await userModel.findById(decoded.id)
        if(!user){
            return res.status(401).json({
                message:"Unauthorized"
            })
        }
        if(user.role !== "seller"){
            return res.status(403).json({
                message:"forbidden"
            })
        }
        req.user = user;
        next();
    }catch(error){
        return res.status(401).json({message:"Unauthorized"})
    }
}

