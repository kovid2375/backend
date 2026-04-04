const followModel = require("../models/follow.model");
const userModel=require("../models/user.model")

async function followuser(req,res) {
    const followerUsername=req.user.username
    const followingUsername=req.params.username


    if(followingUsername=== followerUsername) {
        return res.status(400).json({
            message:"you cannot follow yourself"
        })
    }
    const isAlreadyFollowing= await followModel.findOne({
        follower:followerUsername,
        following:followingUsername
    })
    
    const isFollowingExist=await userModel.findOne({
        username:followingUsername
    })
    if(!isFollowingExist) {
        return res.status(404).json({
            message:"the user you are trying to follow does not exist"
        })
    }


    if(isAlreadyFollowing) {
        return res.status(200).json({
            message:`you are already following ${followingUsername}`,
            follow: isAlreadyFollowing
        })
    }

    const followRecord=await followModel.create({
        follower:followerUsername,
        following:followingUsername
    })

    res.status(201).json({
        message:` you are following ${followingUsername}`,
        follow: followRecord
    })
}

async function unfollowuser(req,res) {
    const followerUsername=req.user.username
    const followingUsername=req.params.username


    const isUserFollowing=await followModel.findOne({
        follower:followerUsername,
        following:followingUsername
    })

    if(!isUserFollowing) {
        return res.status(404).json({
            message:`you are not following ${followingUsername}`
        })
    }

    await followModel.findByIdAndDelete(isUserFollowing._id)

    res.status(200).json({
        message:`you have unfollowed ${followingUsername}`
    })
}

module.exports={followuser,unfollowuser}