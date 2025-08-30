const mongoose = require('mongoose')

const uri = "mongodb+srv://ahmedGamal:a9517538624@mernapp.fjukn.mongodb.net/?retryWrites=true&w=majority&appName=MERNapp"


const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
  }catch(error){

    console.log(error.message)

  }
}
run().catch(console.dir);

module.exports = mongoose