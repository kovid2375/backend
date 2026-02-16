// const express= require('express');
// const app=express();
// app.get("/",(req,res)=>{
//     res.send("hello world");
// })
// app.get("/about",(req,res)=>{
//     res.send("about page");
// })
// app.listen(3000,()=>{
//     console.log("server is running on port 3000");

// })
const express=require('express');
const app=express();
app.use(express.json())//middlewere
const notes=[]

app.post("/notes",(req,res)=>{
    console.log(req.body)
    res.send("Notes")
    notes.push(req.body)
})
app.get("/notes",(req,res)=>{
    res.send(notes)
})

app.listen(3000,()=>{
    console.log("server is running on port 3000");

})