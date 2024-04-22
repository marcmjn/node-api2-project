// implement your server here
// require your posts router and connect it here
const express = require('express') 
const postsRouter = require('./posts/posts-router') //imports postRouter from source
const server = express() 

server.use(express.json()) 

server.use('/api/posts', postsRouter) //mounts postRouter to specified path

server.get('/', (req, res) => {
    res.send(`welcome to this api`)
  })

module.exports = server 