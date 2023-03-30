const axios = require('axios')

axios.defaults.baseURL = 'http://localhost:3000'

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

// fetch users with axios

// axios.get('/users').then(response => {
//   console.log(response.data)
// })

// create a user with axios

async function main() {
  await axios.post('/users', {
    name: 'Armagan',
    hacked: true,
  })

  await axios.post('/users', {
    name: 'Numan',
  })

  await axios.post('/picnics', {
    user: 'Armagan',
    name: "Armagan's Birthday Picnic",
    location: 'Tempelhofer Feld',
    date: '2023-05-01',
  })

  await axios.post('/picnics', {
    user: 'Numan',
    name: "Numan's Counter-Picnic",
    location: 'Hasenheide',
    date: '2023-05-02',
  })

  await axios.post("/picnics/Armagan's Birthday Picnic/attendees", {
    name: 'Numan',
  })

  await axios.post("/picnics/Numan's Counter-Picnic/attendees", {
    name: 'Armagan',
  })

  await axios.put("/picnics/Numan's Counter-Picnic/items", {
    user: 'Armagan',
    name: 'beer',
    quantity: 6,
  })

  await axios.put("/picnics/Numan's Counter-Picnic/items", {
    user: 'Numan',
    name: 'beer',
    quantity: 3,
    desiredQuantity: 12,
  })

  await axios.put("/picnics/Numan's Counter-Picnic/items", {
    user: 'Numan',
    name: 'tent',
    quantity: 1,
  })

  await axios.put("/picnics/Numan's Counter-Picnic/items", {
    user: 'Numan',
    name: 'wine',
    quantity: 2,
  })

  const allUsers = await axios.get('/users')
  console.log('List of all users', allUsers.data)
}

main()
