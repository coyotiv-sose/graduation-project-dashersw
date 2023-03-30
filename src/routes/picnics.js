var express = require('express')
const Picnic = require('../picnic')
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

module.exports = router
