mongoose = require('mongoose')

juz = new mongoose.Schema({

    juzNumber : {
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
    },
    versesCount : {
        type : Number,
        required : true
    }

})

module.exports = mongoose.model('Surah', surah)