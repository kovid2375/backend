// server ko start karna 
// database se connect karna 
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const app = require('./src/app');

const mongoose = require('mongoose');

function connecToDb(){
    mongoose.connect("mongodb://kovid:2011@ac-fxootiv-shard-00-00.zb3ibuw.mongodb.net:27017,ac-fxootiv-shard-00-01.zb3ibuw.mongodb.net:27017,ac-fxootiv-shard-00-02.zb3ibuw.mongodb.net:27017/?ssl=true&replicaSet=atlas-8mj0ca-shard-0&authSource=admin&appName=Cluster0").then(()=>{
        console.log("connected to database")
    })
} 
connecToDb();

app.listen(3000,()=>{
    console.log("server is running on port 3000")
}) 
