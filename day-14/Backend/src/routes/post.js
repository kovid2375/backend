const express = require('express');
const postRouter = express.Router();

const postController= require("../controllers/post.controller")

const multer = require('multer');
const upload = multer({storage:multer.memoryStorage()});

const identifyUser = require('../middlewares/auth.middleware');


/**
 * @route POST /post
 * @desc Create a new post
 * @access Private
 * @body { content: String, image: File (optional) }
 */


postRouter.post("/",upload.single('image'),identifyUser,postController.createPost)



/**
 * @route GET /post
 * @desc Get all posts of a user
 * @access Private
 */

postRouter.get("/",identifyUser,postController.getPost)



/**
 * @route GET /post/details/:postId
 * @desc Get details of a specific post
 * @access Private
 */
postRouter.get("/details/:postId",identifyUser,postController.getPostDetails)
module.exports=postRouter;


/**
 * @route POST /post/like/:postId
 * @desc Like a post
 * @access Private
 */
postRouter.post("/like/:postId",identifyUser,postController.likePost)


/**
 * @route POST /post/unlike/:postId
 * @desc Unlike a post
 * @access Private
 */ 
postRouter.post("/unlike/:postId",identifyUser,postController.unlikePost)


/**
 * @route Get /post/feed
 * @desc get all the post created in the DB
 * @access Private
 */
postRouter.get("/feed",identifyUser,postController.getFeed)

