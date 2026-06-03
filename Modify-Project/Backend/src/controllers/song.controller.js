const songModel=require('../models/song.model')
const id3=require("node-id3")
const storageService=require('../service/storage.service')



async function uploadSong(req,res){
    try{
        if(!req.file){
            return res.status(400).json({
                message:"Song file is required"
            })
        }

        const songBuffer=req.file.buffer
        const tags = id3.read(songBuffer) || {}
        const {mood}=req.body
        const title = tags.title || req.file.originalname.replace(/\.[^/.]+$/, "")

        const songFile=await storageService.uploadFile({
            buffer:songBuffer,
            filename:title + ".mp3",
            folder:"/backend-start/songs"
        })

        let posterFile = null

        if(tags.image && tags.image.imageBuffer){
            posterFile=await storageService.uploadFile({
                buffer:tags.image.imageBuffer,
                filename:title + ".jpeg",
                folder:"/backend-start/posters"
            })
        }

        const song= await songModel.create({
            title,
            url:songFile.url,
            posterUrl:posterFile ? posterFile.url : undefined,
            mood
        })
        res.status(201).json({
            message:"Song uploaded successfully",
            song
        })
        console.log("Received file:", tags)
    }catch(error){
        console.error("Error uploading song:", error)
        res.status(500).json({
            message:"Error uploading song"
        })
    }
}
module.exports={uploadSong}
