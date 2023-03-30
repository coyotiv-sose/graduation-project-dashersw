var express = require('express')
const Picnic = require('../picnic')
const User = require('../user')
var router = express.Router()

/* GET picnics listing. */
router.get('/', function (req, res, next) {
  if (req.query.view === 'json')
    return res.send(
      Picnic.list.map(picnic => ({
        name: picnic.name,
        location: picnic.location,
        date: picnic.date,
        attendees: picnic.attendees.map(attendee => attendee.name),
        items: picnic.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          desiredQuantity: item.desiredQuantity,
          isEnough: item.isEnough,
        })),
      }))
    )

  res.render('picnics', {
    picnics: Picnic.list,
  })
})

/* GET picnic details. */
router.get('/:name', function (req, res, next) {
  const picnic = Picnic.list.find(picnic => picnic.name === req.params.name)

  if (!picnic) return res.status(404).send('Picnic not found')

  if (req.query.view === 'json')
    return res.send({
      name: picnic.name,
      location: picnic.location,
      date: picnic.date,
      attendees: picnic.attendees.map(attendee => attendee.name),
      items: picnic.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        desiredQuantity: item.desiredQuantity,
        isEnough: item.isEnough,
      })),
    })

  res.render('picnic-detail', {
    picnic,
  })
})

// create a picnic for a user
router.post('/', function (req, res, next) {
  const user = User.list.find(user => user.name === req.body.user)

  const picnic = user.createPicnic(req.body.name, req.body.location, req.body.date)

  res.send({ name: picnic.name, location: picnic.location, date: picnic.date })
})

// join a picnic
router.post('/:picnicId/attendees', function (req, res, next) {
  const user = User.list.find(user => user.name === req.body.name)
  const picnic = Picnic.list.find(picnic => picnic.name === req.params.picnicId)

  user.joinPicnic(picnic)

  res.send({
    name: picnic.name,
    location: picnic.location,
    date: picnic.date,
    attendees: picnic.attendees.map(attendee => attendee.name),
  })
})

router.put('/:picnicId/items', function (req, res, next) {
  const user = User.list.find(user => user.name === req.body.user)
  const picnic = Picnic.list.find(picnic => picnic.name === req.params.picnicId)

  user.bringItem(req.body.name, req.body.quantity, picnic, req.body.desiredQuantity)

  res.sendStatus(200)
})

module.exports = router
