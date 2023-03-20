console.log('Picnigram is a social network for making picnics fun again!')

// I need two main objects, Users and Picnics, and Users can create Picnics and other Users can join them
// I need to be able to create a User, create a Picnic, and join a Picnic
// I need to be able to get a list of all Picnics, and get a list of all Users
// I need to be able to get a list of all Picnics a User has created, and get a list of all Picnics a User has joined
// Users should also have a collaborative list of items to bring to a Picnic. This list should be editable by all Users who have joined the Picnic. Users should also be able to remove items from the list. Users should also be able to mark items as "brought" or "not brought" by them.
// Users should also be able to leave a Picnic.
// Users should also be able to delete a Picnic they created.
// Users should also be able to delete their account.
// Users should also be able to edit their account information.
// Users should also be able to edit their Picnic information.
// Users should also be able to edit their Picnic list of items to bring.

class Item {
  whoIsBringingWhat = []

  constructor(name, desiredQuantity = 1) {
    this.name = name
    this.desiredQuantity = desiredQuantity
  }

  get quantity() {
    return this.whoIsBringingWhat.reduce((acc, curr) => acc + curr.quantity, 0)
  }
}
class User {
  picnics = []

  constructor(name) {
    this.name = name
  }

  createPicnic(name, location, date) {
    const picnic = new Picnic(name, location, date)

    this.joinPicnic(picnic)

    return picnic
  }

  joinPicnic(picnic) {
    picnic.attendees.push(this)
    this.picnics.push(picnic)
  }

  bringItem(name, quantity, picnic) {
    let item = picnic.items.find(item => item.name === name)

    if (!item) {
      item = new Item(name, quantity)
      picnic.items.push(item)
    }

    item.whoIsBringingWhat.push({
      user: this,
      quantity: quantity,
    })
  }

  leavePicnic(picnic) {
    picnic.attendees = picnic.attendees.filter(attendee => attendee !== this)
    this.picnics = this.picnics.filter(p => p !== picnic)

    picnic.items.forEach(item => {
      item.whoIsBringingWhat = item.whoIsBringingWhat.filter(whoIsBringingWhat => whoIsBringingWhat.user !== this)
    })
  }
}

class Picnic {
  attendees = []
  items = []

  constructor(name, location, date) {
    this.name = name
    this.location = location
    this.date = date
  }
}

const armagan = new User('Armagan')
const numan = new User('Numan')

const armagansPicnic = armagan.createPicnic("Armagan's Picnic", 'Tempelhofer Feld', '2023-05-01')
const numansPicnic = numan.createPicnic("Numan's Picnic", 'Hasenheide', '2023-05-02')

armagan.joinPicnic(numansPicnic)
numan.joinPicnic(armagansPicnic)

console.log(`armagan has a name of ${armagan.name} and has ${armagan.picnics.length} picnics.`)
console.log(`numan has a name of ${numan.name} and has ${numan.picnics.length} picnics.`)
console.log(
  `armagansPicnic has a name of ${armagansPicnic.name} and takes place in ${armagansPicnic.location} on ${
    armagansPicnic.date
  }, and it has ${armagansPicnic.attendees.length} attendees: ${armagansPicnic.attendees
    .map(attendee => attendee.name)
    .join(', ')}.`
)

console.log(`Numan has joined Armagan's Picnic at ${numan.picnics[0].location} on ${numan.picnics[0].date}.`)

console.log(numansPicnic.items[0])

console.log(`Armagan's picnic has Armagan as the first attendee: ${armagansPicnic.attendees[0] === armagan}`)
console.log(`Armagan's picnic has two attendees: ${armagansPicnic.attendees.length === 2}`)
console.log(`Armagan's picnic has Numan as the second attendee: ${armagansPicnic.attendees[1] === numan}`)
console.log(`Armagan has two picnics: ${armagan.picnics.length === 2}`)

armagan.bringItem('beer', 6, numansPicnic)
numan.bringItem('beer', 3, numansPicnic)

console.log(
  `Numans picnic has ${numansPicnic.items[0].quantity} beers, expected to match 9: ${
    numansPicnic.items[0].quantity === 9
  }`
)

console.log(`Numan's picnic requires 6 beers: ${numansPicnic.items[0].desiredQuantity === 6}`)

numansPicnic.items[0].desiredQuantity = 12

console.log(
  `After updating desired quantity, Numan's picnic now requires 12 beers: ${
    numansPicnic.items[0].desiredQuantity === 12
  }`
)

armagan.leavePicnic(numansPicnic)

console.log(
  `After Armagan leaves Numan's picnic, Numan's picnic has one attendee: ${numansPicnic.attendees.length === 1}`
)
console.log(
  `After Armagan leaves Numan's picnic, Numan's picnic has one items still: ${numansPicnic.items.length === 1}`
)
console.log(`After Armagan leaves Numan's picnic, Numan's picnic has 3 beers: ${numansPicnic.items[0].quantity === 3}`)
