var express = require('express')
const Picnic = require('../picnic')
var router = express.Router()

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send(Picnic.list)
})

// join a picnic
router.post('/:picnicId/attendees', function (req, res, next) {
  try {
    const picnic = Picnic.list.find(picnic => picnic.name === req.params.picnicId)
    const user = User.list.find(user => user.name === req.body.userId)

    user.joinPicnic(picnic)

    res.send({ name: picnic.name, location: picnic.location, date: picnic.date })
  } catch (e) {
    res.status(400).send(e.message)
  }
})

module.exports = router
