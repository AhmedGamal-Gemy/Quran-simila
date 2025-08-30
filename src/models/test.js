const mongoose = require("../config/database")

const testSchema = new mongoose.Schema({

    name : {
        type: String,
        required: true
    },
    test : {
        type: Number,
        required: false
    }

})

const testExample = mongoose.model("example", testSchema )

module.exports = testExample