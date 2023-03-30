var express = require('express')
const User = require('../models/user')
var router = express.Router()

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send(User.list.map(user => ({ name: user.name, picnics: user.picnics.map(picnic => picnic.name) })))
})

/* Create a new user. */
router.post('/', function (req, res, next) {
  const user = User.create({ name: req.body.name })

  res.send(user)
})

module.exports = router
