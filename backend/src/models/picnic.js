const pluralize = require('pluralize')
const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')

const itemSchema = require('./item')

const picnicSchema = new mongoose.Schema({
  name: String,
  location: String,
  date: String,
  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      autopopulate: {
        maxDepth: 1,
      },
    },
  ],
  items: [itemSchema],
})

picnicSchema.plugin(autopopulate)

class Picnic {
  //   get details() {
  //     return `
  // # Picnic ${this.name}
  // ## at ${this.location} on ${this.date}
  // ${this.attendees.length} people are attending:
  // ${this.attendees.map(attendee => attendee.name).join(', ')}
  // They will bring the following items:
  // ${this.items
  //   .map(
  //     item => `
  //   [${item.isEnough ? 'x' : ' '}] ${item.name} (${item.quantity}/${item.desiredQuantity})
  //     ${item.whoIsBringingWhat
  //       .map(
  //         whoIsBringingWhat => `- ${whoIsBringingWhat.user.name} brings ${pluralize(
  //           item.name,
  //           whoIsBringingWhat.quantity,
  //           true
  //         )}.
  //     `
  //       )
  //       .join('')}`
  //   )
  //   .join('')}
  //     `
  //   }
  //   set details(newDetails) {
  //     throw new Error('You cannot edit the details of a picnic directly.')
  //   }
}

picnicSchema.loadClass(Picnic)

module.exports = mongoose.model('Picnic', picnicSchema)
