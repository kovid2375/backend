const express = require('express');
const noteModel = require('../src/models/note.model');
const cors = require('cors');


const app = express();

app.use(cors());
app.use(express.json());





// notes / api/notes
// create new note and save data in mongoDb
app.post('/api/notes', async(req,res)=>{
    const{title,discription}=req.body;

    const note= await noteModel.create({
        title,discription
    })
    res.status(201).json({
        message:"notes Created",
        note
    })
})

// get all notes
// /api/notes 
// fetch all the notes data from mongo db

app.get("/api/notes", async(req,res)=>{
     const notes= await noteModel.find()

     res.status(200).json({
        message:"Notes Fetched",
        notes
     })
})

// Delete - /api/notes/:id
// delete note with the id form req.params

app.delete('/api/notes/:id', async (req,res)=>{
    const id = req.params.id
    await noteModel.findByIdAndDelete(id)
    
    res.status(200).json({
        message:"Note Deleted"
    })
})

// Patch - /api/notes/:id
// update the discription of the note by id
// req.body={discription}

app.patch('/api/notes/:id', async(req,res)=>{
    const id = req.params.id
    const {discription}=req.body

    await noteModel.findByIdAndUpdate(id,{discription})

    res.status(200).json({
        message:"Note Updated"
    })
})





module.exports = app;