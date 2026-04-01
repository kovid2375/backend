const express = require('express');
const postRouter = express.Router();

const postController= require("../controllers/post.controller")

const multer = require('multer');
const upload = multer({storage:multer.memoryStorage()});



// post /auth/post [protected route]
// req.body -> caption, imgUrl, userId


postRouter.post("/",upload.single('image'),postController.createPost)

module.exports=postRouter;