require('dotenv').config()

const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const pluralize = require('pluralize')
const cors = require('cors')
const session = require('express-session')
const MongoStore = require('connect-mongo')

const mongoose = require('mongoose')

require('./database-connection')

const usersRouter = require('./routes/users')
const picnicsRouter = require('./routes/picnics')
const accountsRouter = require('./routes/accounts')

const User = require('./models/user')
const passport = require('passport')

// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy())

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

const app = express()

app.use(
  cors({
    origin: true,
    credentials: true,
  })
)

app.locals.pluralize = pluralize

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

const clientPromise = mongoose.connection.asPromise().then(connection => (connection = connection.getClient()))

const sessionMiddleware = session({
  secret: 'asdg2356gb34!!rwet5',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 15, // 15 days
  },
  store: MongoStore.create({ clientPromise, stringify: false }),
})

app.use(sessionMiddleware)

app.use(passport.session())

app.use((req, res, next) => {
  const numberOfVisits = req.session.numberOfVisits || 0
  req.session.numberOfVisits = numberOfVisits + 1
  req.session.history = req.session.history || []
  req.session.history.push({ url: req.url, ip: req.ip })

  next()
})

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/users', usersRouter)
app.use('/picnics', picnicsRouter)
app.use('/accounts', accountsRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  console.log(err)

  // render the error page
  res.status(err.status || 500)
  res.send(err)
})

app.createSocketServer = function (server) {
  const io = require('socket.io')(server, {
    cors: {
      origin: true,
      credentials: true,
    },
  })

  app.set('io', io)

  io.engine.use(sessionMiddleware)
  io.engine.use(passport.session())

  console.log('socket.io server created')

  io.on('connection', function (socket) {
    console.log('a user connected', socket.request.user?._id.toString())

    socket.on('disconnect', function () {
      console.log('user disconnected')
    })

    socket.on('join picnic', function (picnicId) {
      console.log(`user ${socket.request.user._id.toString()} joined picnic ${picnicId}`)
      socket.join(picnicId)
    })

    socket.on('leave picnic', function (picnicId) {
      console.log(`user ${socket.request.user._id.toString()} left picnic ${picnicId}`)
      socket.leave(picnicId)
    })
  })
}

module.exports = app
