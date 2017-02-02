import bodyParser from 'body-parser'
import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import socketio from 'socket.io'
import { Server } from 'http'

import config from './config.json'
import routes from './routes/'
import userCtrl from './controllers/userController'

const app = express()
const server = Server(app)
const io = socketio(server)

app.use((req, res, next) => {
  res.io = io
  next()
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(`${__dirname}/public`))
app.use(session({ secret: 'Kaso122@', cookie: {} }))

app.set('views', `${__dirname}/views`)
app.set('view engine', 'ejs')

mongoose.connect('mongodb://localhost:27017/chat');

app.get('/', userCtrl.getUsers)

app.use('/api', routes)

io.on('connection', (socket) => {
  socket.on('connect', (data) => {
    console.log(data)
  })
})

app.set('port', config.port)

server.listen(config.port, (err) => {
  if (err) return console.error(`A error ocurred trying lift the express: ${err}`)

  return console.log(`Chat server running on port ${config.port}`)
})
