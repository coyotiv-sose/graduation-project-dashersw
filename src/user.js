const Picnic = require('./picnic')
const Item = require('./item')

class User {
  picnics = []

  constructor(name) {
    this.name = name
  }

  createPicnic(name, location, date) {
    const picnic = Picnic.create({ name, location, date })

    this.joinPicnic(picnic)

    return picnic
  }

  joinPicnic(picnic) {
    picnic.attendees.push(this)
    this.picnics.push(picnic)
  }

  bringItem(name, quantity, picnic, desiredQuantity = quantity) {
    let item = picnic.items.find(item => item.name === name)

    if (!item) {
      item = new Item(name, quantity)
      picnic.items.push(item)
    }

    let userAlreadyBringingItem = item.whoIsBringingWhat.find(whoIsBringingWhat => whoIsBringingWhat.user === this)

    if (!userAlreadyBringingItem) {
      userAlreadyBringingItem = {
        user: this,
      }

      item.whoIsBringingWhat.push(userAlreadyBringingItem)
    }

    userAlreadyBringingItem.quantity = quantity
    item.desiredQuantity = desiredQuantity
  }

  leavePicnic(picnic) {
    picnic.attendees = picnic.attendees.filter(attendee => attendee !== this)
    this.picnics = this.picnics.filter(p => p !== picnic)

    picnic.items.forEach(item => {
      item.whoIsBringingWhat = item.whoIsBringingWhat.filter(whoIsBringingWhat => whoIsBringingWhat.user !== this)
    })
  }

  get profile() {
    return `
# ${this.name}

${this.picnics.length} picnics:
${this.picnics
  .map(
    picnic => `
- ${picnic.name} at ${picnic.location} on ${picnic.date}

${this.name} will bring the following items:
${picnic.items
  .filter(picnicItem => picnicItem.whoIsBringingWhat.find(whoIsBringingWhat => whoIsBringingWhat.user === this))
  .map(
    item =>
      `${item.name} (${item.whoIsBringingWhat.find(whoIsBringingWhat => whoIsBringingWhat.user === this).quantity}/${
        item.desiredQuantity
      })`
  )
  .join(', ')}
`
  )
  .join('')}
    `
  }

  static create({ name }) {
    const newUser = new User(name)

    User.list.push(newUser)
    return newUser
  }

  static list = []
}

module.exports = User
