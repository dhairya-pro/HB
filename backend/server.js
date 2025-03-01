import 'dotenv/config'


import http from 'http'
import app from './app.js'

const Port = process.env.PORT || 3000;
const server = http.createServer(app)

server.listen(Port,()=>{
    console.log(`server is running at ${Port}`)
})