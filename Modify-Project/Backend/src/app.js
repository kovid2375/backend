const express = require('express');
const cors=require('cors');
const cookie = require('cookie-parser')

const app=express()




app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(cookie())


const authRouter=require('./routes/auth.routes')

app.use('/auth',authRouter)

const songRoutes=require('./routes/song.routes')

app.use('/song',songRoutes)










module.exports=app;
