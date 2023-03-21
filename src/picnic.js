class Picnic {
  attendees = []
  items = []

  constructor(name, location, date) {
    this.name = name
    this.location = location
    this.date = date
  }

  get details() {
    return `
# Picnic ${this.name}
## at ${this.location} on ${this.date}

${this.attendees.length} people are attending:
${this.attendees.map(attendee => attendee.name).join(', ')}

They will bring the following items:
${this.items
  .map(
    item => `
  [${item.isEnough ? 'x' : ' '}] ${item.name} (${item.quantity}/${item.desiredQuantity})
    ${item.whoIsBringingWhat
      .map(
        whoIsBringingWhat => `- ${whoIsBringingWhat.user.name} brings ${whoIsBringingWhat.quantity} ${item.name}.
    `
      )
      .join('')}`
  )
  .join('')}
    `
  }

  set details(newDetails) {
    throw new Error('You cannot edit the details of a picnic directly.')
  }
}

module.exports = Picnic
