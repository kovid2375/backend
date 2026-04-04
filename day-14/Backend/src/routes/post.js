const express = require('express');
const postRouter = express.Router();

const postController= require("../controllers/post.controller")

const multer = require('multer');
const upload = multer({storage:multer.memoryStorage()});

const identifyUser = require('../middlewares/auth.middleware');


// post /auth/post [protected route]
// req.body -> caption, imgUrl, userId


postRouter.post("/",upload.single('image'),identifyUser,postController.createPost)



//Get /auth/post-> [protected route] get all posts of a user
postRouter.get("/",identifyUser,postController.getPost)



// Get /post/details/:postId-> return an detail about specific post with the id. aslo check wether the post belongs to the user taht the request come from or not. if not return unauthorized access
postRouter.get("/details/:postId",identifyUser,postController.getPostDetails)
module.exports=postRouter;