const connectToMongo = require('./db');
// const serverless = require('serverless-http');
connectToMongo()

const express = require('express')
var cors = require('cors')
const app = express()
const port = 5000;
app.use(cors())

app.use(express.json())

//Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
 
app.listen(port, () => {      
  console.log(`NoteBook app listening on port ${port}`) 
}) 

// module.exports.handler = serverless(app);    
