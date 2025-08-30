mongoose = require("../config/database")

verse = new mongoose.Schema({

    content : {
        type : String,
        required : true,
    },
    verseNumber : {
        type : Number,
        required : true,
    },
    globalVerseNumber : {
        type : Number,
        required : true
    },
    surahNumber : {
        type : Number,
        required : true,
    },
    page : {
        type : Number,
        required : true
    },
    juz : {
        type : Number,
        required : true
    },
    
})

module.exports = mongoose.model('Verse', verse)