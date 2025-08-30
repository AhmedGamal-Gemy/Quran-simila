express = require('express')
cors = require('cors')
testRoute = require('./routes/testRoute')

app = express()

app.use( cors() )
app.use( express.json() )

console.log('TEST')

app.use("/api/test", testRoute )


module.exports = app
