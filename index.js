// import all packages
const express = require('express')
const cors = require('cors')
// add .env file contents into process.env by default
require('dotenv').config()
const routes = require("./routes/allRoutes")
// import of db
require('./config/db')



// ceate server
const server = express()
// enable cors in server
server.use(cors())

// parse JSON to js content
server.use(express.json())

// use routes
server.use(routes)
// port
const PORT = process.env.PORT
// start server
server.listen(PORT,()=>{
    console.log("Server Started...");
})
// resolve api in browser using ge request
server.get('/',(req,res)=>{
    res.status(200).send('<h1>Server Started and waiting for get request !!!!!</h1>')
}) 


server.post('/',(req,res)=>{
    res.status(200).send("Post Request")
})