const Picnic = require('./picnic')
const Item = require('./item')
const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  picnics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Picnic',
      autopopulate: false,
    },
  ],
})

userSchema.plugin(autopopulate)
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' })

class User {
  async createPicnic(name, location, date, description) {
    const picnic = await Picnic.create({ name, location, date, description })

    await this.joinPicnic(picnic)

    return picnic
  }

  async joinPicnic(picnic) {
    picnic.attendees.push(this)
    this.picnics.push(picnic)

    await picnic.save()
    await this.save()
  }

  async bringItem(name, quantity, picnic, desiredQuantity = quantity) {
    let item = picnic.items.find(item => item.name === name)

    let newItem = false

    if (!item) {
      item = { name, quantity, whoIsBringingWhat: [], desiredQuantity: 1 }

      newItem = true
    }

    let userAlreadyBringingItem = item.whoIsBringingWhat.find(whoIsBringingWhat =>
      whoIsBringingWhat.user._id.equals(this._id)
    )

    let newUser = false

    if (!userAlreadyBringingItem) {
      userAlreadyBringingItem = {
        user: {
          name: this.name,
          _id: this._id,
        },
        quantity: 0,
      }

      newUser = true
    }

    userAlreadyBringingItem.quantity += quantity

    if (newUser) item.whoIsBringingWhat.push(userAlreadyBringingItem)

    item.desiredQuantity = desiredQuantity

    if (newItem) picnic.items.push(item)
    await picnic.save()
  }

  async leavePicnic(picnic) {
    picnic.attendees.pull(this)
    this.picnics.pull(picnic)

    picnic.items.forEach(item => {
      item.whoIsBringingWhat.pull({ user: this._id })
    })

    await picnic.save()
    await this.save()
  }

  //   get profile() {
  //     return `
  // # ${this.name}

  // ${this.picnics.length} picnics:
  // ${this.picnics
  //   .map(
  //     picnic => `
  // - ${picnic.name} at ${picnic.location} on ${picnic.date}

  // ${this.name} will bring the following items:
  // ${picnic.items
  //   .filter(picnicItem => picnicItem.whoIsBringingWhat.find(whoIsBringingWhat => whoIsBringingWhat.user === this))
  //   .map(
  //     item =>
  //       `${item.name} (${item.whoIsBringingWhat.find(whoIsBringingWhat => whoIsBringingWhat.user === this).quantity}/${
  //         item.desiredQuantity
  //       })`
  //   )
  //   .join(', ')}
  // `
  //   )
  //   .join('')}
  //     `
  //   }
}

userSchema.loadClass(User)

module.exports = mongoose.model('User', userSchema)
