import express from "express";
import useGraph from "./services/grap.ai.service.js"
const app = express()


app.get("/health",(req,res)=>{
    res.status(200).json({status:"ok"})
})

app.post("/use-graph",async(req,res)=>{
    const response = await useGraph("Write an optimize factorial function in javascript?")
    res.json({ response })
})


export default app