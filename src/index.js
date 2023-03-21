const User = require('./user')

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

const armagan = new User('Armagan')
const numan = new User('Numan')

const armagansPicnic = armagan.createPicnic(`Armagan's Birthday Picnic`, 'Tempelhofer Feld', '2023-05-01')
const numansPicnic = numan.createPicnic(`Numan's Counter-Picnic`, 'Hasenheide', '2023-05-02')

armagan.joinPicnic(numansPicnic)
numan.joinPicnic(armagansPicnic)

armagan.bringItem('beer', 6, numansPicnic)
numan.bringItem('beer', 3, numansPicnic)
numan.bringItem('tent', 1, numansPicnic)
numan.bringItem('wine', 2, numansPicnic)

numansPicnic.items[0].desiredQuantity = 12
console.log(numansPicnic.details)
// console.log(armagan.profile)
// console.log(numan.profile)
