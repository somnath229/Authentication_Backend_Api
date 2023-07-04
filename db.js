const mongoose = require('mongoose');
const mongoURI =
  "mongodb+srv://root:root@cluster0.volyd4f.mongodb.net/somnath01";

const connectToMongo = () =>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to mongo successfully.")
    })
}

module.exports = connectToMongo;