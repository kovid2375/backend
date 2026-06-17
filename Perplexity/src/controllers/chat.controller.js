import { generateResponse,generateChatTitle } from "../Services/ai.service";
import chatModel from "../models/chat.model.js"
import messageModel from "../models/message.model.js"


export async function sendMessage(req,res){
    const {message,chat:chatId}=req.body

    let title = null , chat=null

    if(!chatId){
        title=await generateChatTitle(message)
        chat=await chatModel.create({
            user:req.user.id,
            title
        })
    }

    const userMessage=await messageModel.create({
        chat:chatId || chat._id,
        content:message,
        role:"user"
    })

    const messages=await messageModel.find({chat:chatId||chat._id})
    const result=await generateResponse(messages)

    const aiMessage=await messageModel.create({
        chat:chatId || chat._id,
        content:result,
        role:"ai"
    })

    res.status(201).json({
        title,
        chat,
        aiMessage
    })
}

export async function getMessages(req,res){
    const {chatId}=req.params

    const chat=await chatModel.findOne({
        _id:chatId,
        user:req.user._id
    })

    if(!chat){
        return res.status(404).json({
            message:"chat not found"
        })
    }
    const messages=await messageModel.find({
        chat:chatId
    })
    res.status(200).json({
        message:"messages retireved successfully",
        messages
    })
}


export async function deleteChat(req,res){
    const {chatId}=req.params
    const chat=await chatModel.findOneAndDelete({
        _id:chatId,
        user:req.user.id
    })
    await messageModel.deleteMany({
        chat:chatId
    })

    if(!chat){
        return res.status(404).json({
            message:"chat not found"
        })
    }

    res.status(200).json({
        message:"chat deleted successfully"
    })
}



export async function getChats(req,res){
    const chats=await chatModel.find({
        user:req.user.id
    })
    res.status(200).json({
        chats
    })
}