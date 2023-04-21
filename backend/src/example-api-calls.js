const axios = require('axios')
const User = require('./models/user')
const Picnic = require('./models/picnic')
axios.defaults.baseURL = 'http://localhost:3000'

require('dotenv').config()
require('./database-connection')

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

async function main() {
  await User.deleteMany()
  await Picnic.deleteMany()

  const armagan = await axios.post('/users', {
    name: 'Armagan',
    email: 'armagan@coyotiv.com',
    password: '123456~',
  })

  const numan = await axios.post('/users', {
    name: 'Numan',
    email: 'numan@coyotiv.com',
    password: '123456~',
  })

  const armagansBirthdayPicnic = await axios.post('/picnics', {
    user: armagan.data._id,
    name: "Armagan's Birthday Picnic",
    location: 'Tempelhofer Feld',
    date: '2023-05-01',
  })

  const numansCounterPicnic = await axios.post('/picnics', {
    user: numan.data._id,
    name: "Numan's Counter-Picnic",
    location: 'Hasenheide',
    date: '2023-05-02',
  })

  await axios.post(`/picnics/${armagansBirthdayPicnic.data._id}/attendees`, {
    user: numan.data._id,
  })

  await axios.post(`/picnics/${numansCounterPicnic.data._id}/attendees`, {
    user: armagan.data._id,
  })

  await axios.put(`/picnics/${numansCounterPicnic.data._id}/items`, {
    user: armagan.data._id,
    name: 'beer',
    quantity: 6,
  })

  await axios.put(`/picnics/${numansCounterPicnic.data._id}/items`, {
    user: numan.data._id,
    name: 'beer',
    quantity: 3,
    desiredQuantity: 12,
  })

  await axios.put(`/picnics/${numansCounterPicnic.data._id}/items`, {
    user: numan.data._id,
    name: 'tent',
    quantity: 1,
  })

  await axios.put(`/picnics/${numansCounterPicnic.data._id}/items`, {
    user: numan.data._id,
    name: 'wine',
    quantity: 2,
  })

  const allUsers = await axios.get('/users')
  console.log('List of all users', allUsers.data)

  console.log(
    `The last picnic should have two wines`,
    allUsers.data[1].picnics[0].items[2].name == 'wine',
    allUsers.data[1].picnics[0].items[2].quantity == 2
  )

  console.log(
    `The last picnic should have one tent`,
    allUsers.data[1].picnics[0].items[1].name == 'tent',
    allUsers.data[1].picnics[0].items[1].quantity == 1
  )

  console.log(
    `The last picnic should have 9 beers`,
    allUsers.data[1].picnics[0].items[0].name == 'beer',
    allUsers.data[1].picnics[0].items[0].quantity == 9
  )
}

main().catch(error => {
  console.log(error.message ? error.message : error)
})
