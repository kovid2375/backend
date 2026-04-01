const express = require('express');
const cookieParser=require('cookie-parser');
const authRouter=require('./routes/auth')
const postRouter=require('./routes/post')
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/auth',authRouter)
app.use('/post',postRouter)



module.exports = app;