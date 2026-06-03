const mongoose = require('mongoose')

const songSchema = new mongoose.Schema({
    url:{
        type:String,
        required:true
    },
    posterUrl:{
        type:String
    },
    title:{
        type:String,
        required:true
    },
    mood:{
        type:String,
        enum:{ values:["happy","sad","surprised"],
                message:"{VALUE} is not supported"
        },
    }
})
const songModel = mongoose.model("songs",songSchema)

module.exports = songModel
