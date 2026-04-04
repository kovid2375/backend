const jwt = require('jsonwebtoken')


async function identifyuser(req,res,next) {
    const token = req.cookies.token
    if (!token){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    let decoded = null
    try {
        decoded = jwt.verify(token,process.env.JWT_SECRET)
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    req.user=decoded
    next()
}

module.exports = identifyuser