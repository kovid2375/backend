const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({ // database ko batana ki hum kis formate me data store karenge 
    title:String,
    description:String,
    
});

const noteModel=mongoose.model("notes", noteSchema) //

module.exports=noteModel;