var express = require('express')
const Picnic = require('../picnic')
const User = require('../user')
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

// create a picnic for a user
router.post('/:userId/picnics', function (req, res, next) {
  const user = User.list.find(user => user.name === req.params.userId)

  const picnic = user.createPicnic(req.body.name, req.body.location, req.body.date)

  res.send({ name: picnic.name, location: picnic.location, date: picnic.date })
})

// join a picnic
router.post('/:userId/picnics/:picnicId/attendees', function (req, res, next) {
  try {
    const user = User.list.find(user => user.name === req.params.userId)
    const picnic = Picnic.list.find(picnic => picnic.name === req.params.picnicId)

    user.joinPicnic(picnic)

    res.send({
      name: picnic.name,
      location: picnic.location,
      date: picnic.date,
      attendees: picnic.attendees.map(attendee => attendee.name),
    })
  } catch (e) {
    res.status(400).send(e.message)
  }
})

module.exports = router
