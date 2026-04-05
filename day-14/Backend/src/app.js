const express = require('express');
const cookieParser=require('cookie-parser');
const cors=require('cors');

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


// required routes
const authRouter=require('./routes/auth')
const postRouter=require('./routes/post')
const userRouter=require('./routes/user.routes')

// using routes
app.use('/auth',authRouter)
app.use('/post',postRouter)
app.use('/user',userRouter)


module.exports = app;