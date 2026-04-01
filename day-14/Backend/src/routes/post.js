const express = require('express');
const postRouter = express.Router();

const postController= require("../controllers/post.controller")

const multer = require('multer');



// post /auth/post [protected route]
// req.body -> caption, imgUrl, userId


postRouter.post("/",postController.createPost)

module.exports=postRouter;