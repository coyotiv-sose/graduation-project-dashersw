var express = require('express')
const User = require('../models/user')
var router = express.Router()

/* GET users listing. */
router.get('/', async function (req, res, next) {
  res.send(await User.find())
})

/* Create a new user. */
router.post('/', async function (req, res, next) {
  const user = await User.create({ name: req.body.name })

  res.send(user)
})

module.exports = router
