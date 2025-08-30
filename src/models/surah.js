mongoose = require('mongoose')

surah = new mongoose.Schema({

    surahName : {
        type : String,
        required : true
    },
    surahNumber : {
        type : Number,
        required : true
    },
    globalStartVerse : {
        type : Number,
        required : true
    },
    globalEndVerse : {
        type : Number,
        required : true
    }

})

module.exports = mongoose.model('Surah', surah)