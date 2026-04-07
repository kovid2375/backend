const postModel= require("../models/post.model")
const {toFile}= require("@imagekit/nodejs")
const ImageKit=require("@imagekit/nodejs")
const jwt = require('jsonwebtoken')
const likeModel = require("../models/likes.model")


const imagekit=new ImageKit({
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY,
})

async function createPost(req,res) {

    console.log(req.body,req.file);
    const file= await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer),'file'),
        fileName:"test",
        folder:"instagram-clone"
    })
    
    

    const post = await postModel.create({
        caption:req.body.caption,
        imgUrl:file.url,
        user:req.user.id
    })
    
    res.status(201).json({
        message:"post created successfully",
        post
    })
    
}

async function getPost(req,res) {


    
   const userId=req.user.id

   const post = await postModel.find({
    user:userId
   })

   res.status(200).json({
    message:"Posts fetched successfully",
    post
   })
}

async function getPostDetails(req,res) {

  
   const userId=req.user.id

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
async function likePost(req,res) {
    const userName=req.user.username
    const postId=req.params.postId

    const post = await postModel.findById(postId)

    if(!post){
        return res.status(404).json({
            message:"Post not found"
        })
    
    }

    const like = await likeModel.create({
        post:postId,
        user:userName
     })

    res.status(201).json({
        message:"Post liked successfully",
        like
    })

}

async function getFeed(req,res) {
    const user=req.user
    const post = await Promise.all((await postModel.find().populate("user").lean()).map(async(post)=>{
        const isLiked=await likeModel.findOne({
            user:user.username,
            post:post._id
        
        })
        post.isLiked=Boolean(isLiked)
        return post
    }))
    res.status(200).json({
        message:"Feed fetched successfully",
        post
    })
}


module.exports={createPost, getPost, getPostDetails, likePost, getFeed};