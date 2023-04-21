var express = require('express')
const User = require('../models/user')
var router = express.Router()

/* GET users listing. */
router.get('/', async function (req, res, next) {
  res.send(await User.find())
})

router.get('/:id', async function (req, res, next) {
  const user = await User.findById(req.params.id).populate('picnics')

  if (!user) return next({ status: 404, message: 'User not found' })

  res.send(user)
})

/* Create a new user. */
router.post('/', async function (req, res, next) {
  const { name, email, password } = req.body

  const user = await User.register({ name, email }, password)

  res.send(user)
})

module.exports = router
