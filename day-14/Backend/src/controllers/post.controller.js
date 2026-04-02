const postModel= require("../models/post.model")
const {toFile}= require("@imagekit/nodejs")
const ImageKit=require("@imagekit/nodejs")
const jwt = require('jsonwebtoken')



const imagekit=new ImageKit({
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY,
})

async function createPost(req,res) {

    console.log(req.body,req.file);

    const  token=req.cookies.token

    if(!token){
        return res.status(401).json({
            message:"Unauthorized"
        })

    }

    let decoded=null

   try {
    decoded=jwt.verify(token, process.env.JWT_SECRET)
    console.log(decoded);
   } catch (error) {
    return res.status(401).json({
        message:"Unauthorized access"
    })
   }

    
    


    const file= await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer),'file'),
        fileName:"test",
        folder:"instagram-clone"
    })
    
    

    const post = await postModel.create({
        caption:req.body.caption,
        imgUrl:file.url,
        user:decoded.id
    })
    
    res.status(201).json({
        message:"post created successfully",
        post
    })
    
}

async function getPost(req,res) {


    const  token=req.cookies.token


    let decoded;

   try {
    decoded=jwt.verify(token, process.env.JWT_SECRET)
    console.log(decoded);
   } catch (error) {
    return res.status(401).json({
        message:"Unauthorized access"
    })
   }

   const userId=decoded.id

   const post = await postModel.find({
    user:userId
   })

   res.status(200).json({
    message:"Posts fetched successfully",
    post
   })
}

async function getPostDetails(req,res) {

    const token=req.cookies.token
    if(!token){
        return res.status(401).json({
            message:"Unauthorized access"
        })
    }

    let decoded;

   try {
    decoded=jwt.verify(token, process.env.JWT_SECRET)
    console.log(decoded);
   } catch (error) {
    return res.status(401).json({
        message:"Unauthorized access"
    })
   }

   const userId=decoded.id

   const postId=req.params.postId
   const post=await postModel.findById(postId)
   if(!post){
    return res.status(404).json({
        message:"Post not found"
    })
   }

   const isValidUser= post.user.toString() === userId

   if(!isValidUser){
    return res.status(403).json({
        message:"forbidden Content"
    })
   }

   res.status(200).json({
    message:"Post fetched successfully",
    post
   })

    
}
module.exports={createPost, getPost, getPostDetails};