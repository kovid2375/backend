const express = require('express');
const userRouter = express.Router();
const userController=require("../controllers/user.controller")
const identifyUser= require("../middlewares/auth.middleware")


/**
 * @route POST /follow/:username
 * @desc Follow a user
 * @access Private
 */

userRouter.post("/follow/:username",identifyUser,userController.followuser)


/**
 * @route POST /unfollow/:username
 * @desc Unfollow a user
 * @access Private
 */

userRouter.post("/unfollow/:username",identifyUser,userController.unfollowuser)

/**
 * @route Get /user/following
 * @desc get user followers
 * @access Private
 */
userRouter.get("/following",identifyUser,userController.getFollowing)



/**
 * @route Get /user/all 
 * @desc get all users 
 * @access Private
 */
userRouter.get("/all",identifyUser,userController.getAllUsers)
module.exports=userRouter;