require('dotenv').config()

const app = require('./src/app');
const connectDB =require('../Backend/src/config/database')

connectDB();

app.listen(3000,()=>{
    console.log("sever is running");
    
})

