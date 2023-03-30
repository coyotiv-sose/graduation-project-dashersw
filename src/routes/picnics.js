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

module.exports = router
