var express = require('express')
const Picnic = require('../models/picnic')
const User = require('../models/user')
var router = express.Router()
const generateDescription = require('../lib/description-generator')

/* GET picnics listing. */
router.get('/', async function (req, res, next) {
  const picnics = await Picnic.find()

  res.send(picnics)
})

/* GET picnic details. */
router.get('/:id', async function (req, res, next) {
  const picnic = await Picnic.findById(req.params.id)

  if (!picnic) return next({ status: 404, message: 'Picnic not found' })

  res.send(picnic)
})

// create a picnic for a user
router.post('/', async function (req, res, next) {
  const user = await User.findById(req.body.user)

  const description = await generateDescription({
    name: req.body.name,
    location: req.body.location,
    date: req.body.date,
  })

  const picnic = await user.createPicnic(req.body.name, req.body.location, req.body.date, description)

  res.send(picnic)
})

// join a picnic
router.post('/:picnicId/attendees', async function (req, res, next) {
  const user = await User.findById(req.body.user)

  const picnic = await Picnic.findById(req.params.picnicId)

  await user.joinPicnic(picnic)

  res.send(picnic)
})

router.put('/:picnicId/items', async function (req, res, next) {
  const user = await User.findById(req.body.user)
  const picnic = await Picnic.findById(req.params.picnicId)

  await user.bringItem(req.body.name, req.body.quantity, picnic, req.body.desiredQuantity)

  res.send(picnic)
})

router.delete('/:picnicId/attendees', async function (req, res, next) {
  const user = await User.findById(req.body.user)
  const picnic = await Picnic.findById(req.params.picnicId)

  await user.leavePicnic(picnic)

  const updatedPicnic = await Picnic.findById(req.params.picnicId)

  res.send(updatedPicnic)
})

module.exports = router
