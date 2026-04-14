const jwt = require('jsonwebtoken')
const blacklistModel=require('../models/blacklist.model')

async function identifyuser(req,res,next) {
    const token=req.cookies.token
    if (!token){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    const isBlackListedToken= await blacklistModel.findOne({
        token
    })
    if (isBlackListedToken){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    let decoded = null
    try {
        decoded = jwt.verify(token,process.env.JWT_SECRET)
    }catch(err){
        return res.status(401).json({
            message: "Unauthorized"
        })
    
    }
    req.user=decoded
    next()

}




module.exports = identifyuser