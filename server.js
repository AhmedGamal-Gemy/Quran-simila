app = require("./src/app")
config = require("./src/config/config")

port = config.PORT || 3000

app.listen(port, () => {

    console.log(`Server is running in ${port}`)

})