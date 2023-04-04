var express = require('express')
const Picnic = require('../models/picnic')
const User = require('../models/user')
var router = express.Router()

/* GET picnics listing. */
router.get('/', async function (req, res, next) {
  const picnics = await Picnic.find()

  if (req.query.view === 'json') return res.send(picnics)

  res.render('picnics', {
    picnics,
  })
})

/* GET picnic details. */
router.get('/:id', async function (req, res, next) {
  const picnic = await Picnic.findById(req.params.id)

  if (!picnic) return res.status(404).send('Picnic not found')

  if (req.query.view === 'json') return res.send(picnic)

  res.render('picnic-detail', {
    picnic,
  })
})

// create a picnic for a user
router.post('/', async function (req, res, next) {
  const user = await User.findById(req.body.user)

  const picnic = await user.createPicnic(req.body.name, req.body.location, req.body.date)

  res.send(picnic)
})

// join a picnic
router.post('/:picnicId/attendees', async function (req, res, next) {
  const user = await User.findById(req.body.user)

  console.log('user', req.body.user, req.params.picnicId)
  const picnic = await Picnic.findById(req.params.picnicId)

  await user.joinPicnic(picnic)

  res.send({
    name: picnic.name,
    location: picnic.location,
    date: picnic.date,
    attendees: picnic.attendees.map(attendee => attendee.name),
  })
})

router.put('/:picnicId/items', async function (req, res, next) {
  const user = await User.findById(req.body.user)
  const picnic = await Picnic.findById(req.params.picnicId)

  await user.bringItem(req.body.name, req.body.quantity, picnic, req.body.desiredQuantity)

  res.sendStatus(200)
})

module.exports = router
