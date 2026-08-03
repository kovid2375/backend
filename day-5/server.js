// server ko start karna 
// database se connect karna 
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const app = require('./src/app');

const mongoose = require('mongoose');

function connecToDb(){
    mongoose.connect("hello").then(()=>{
        console.log("connected to database")
    })
} 
connecToDb();

app.listen(3000,()=>{
    console.log("server is running on port 3000")
}) 
