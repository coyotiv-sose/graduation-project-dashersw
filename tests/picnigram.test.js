const request = require('supertest')
const User = require('../src/models/user')
const Picnic = require('../src/models/picnic')

const app = require('../src/app')

describe('Picnigram', () => {
  beforeEach(async () => {
    await User.deleteMany()
    await Picnic.deleteMany()
  })

  it('can create a user', async () => {
    const name = 'Armagan'

    const expectedOutput = {
      name,
      picnics: [],
    }

    const actualOutput = await request(app).post('/users').send({ name })

    expect(actualOutput.body).toMatchObject(expectedOutput)

    expect(actualOutput.body._id).toBeDefined()
  })

  it('can create a picnic', async () => {
    const name = 'Armagan'

    const user = await request(app).post('/users').send({ name })

    const picnicName = "Armagan's Birthday Picnic"
    const location = 'Tempelhofer Feld'
    const date = '2023-05-01'

    const expectedOutput = {
      name: picnicName,
      location,
      date,
      attendees: [user.body],
      items: [],
    }

    const actualOutput = await request(app)
      .post('/picnics')
      .send({ user: user.body._id, name: picnicName, location, date })

    expect(actualOutput.body).toMatchObject(expectedOutput)

    expect(actualOutput.body._id).toBeDefined()
  })

  it('can add an attendee to a picnic', async () => {
    const armagan = await request(app).post('/users').send({ name: 'Armagan' })
    const numan = await request(app).post('/users').send({ name: 'Numan' })

    const picnicName = "Armagan's Birthday Picnic"
    const location = 'Tempelhofer Feld'
    const date = '2023-05-01'

    const picnic = await request(app)
      .post('/picnics')
      .send({ user: armagan.body._id, name: picnicName, location, date })

    const expectedOutput = {
      name: picnicName,
      location,
      date,
      attendees: [{ _id: armagan.body._id }, { _id: numan.body._id }],
      items: [],
    }

    const actualOutput = await request(app).post(`/picnics/${picnic.body._id}/attendees`).send({ user: numan.body._id })

    expect(actualOutput.body).toMatchObject(expectedOutput)

    expect(actualOutput.body._id).toBeDefined()
  })

  it('can add an item to a picnic', async () => {
    const armagan = await request(app).post('/users').send({ name: 'Armagan' })

    const picnicName = "Armagan's Birthday Picnic"
    const location = 'Tempelhofer Feld'
    const date = '2023-05-01'

    const picnic = await request(app)
      .post('/picnics')
      .send({ user: armagan.body._id, name: picnicName, location, date })

    const expectedOutput = {
      name: picnicName,
      location,
      date,
      attendees: [{ _id: armagan.body._id }],
      items: [{ name: 'beer', quantity: 6 }],
    }

    const actualOutput = await request(app)
      .put(`/picnics/${picnic.body._id}/items`)
      .send({ user: armagan.body._id, name: 'beer', quantity: 6 })

    expect(actualOutput.body).toMatchObject(expectedOutput)

    expect(actualOutput.body._id).toBeDefined()
  })

  it('can let the same person bring more of the same item', async () => {
    const armagan = await request(app).post('/users').send({ name: 'Armagan' })

    const picnicName = "Armagan's Birthday Picnic"
    const location = 'Tempelhofer Feld'
    const date = '2023-05-01'

    const picnic = await request(app)
      .post('/picnics')
      .send({ user: armagan.body._id, name: picnicName, location, date })

    await request(app)
      .put(`/picnics/${picnic.body._id}/items`)
      .send({ user: armagan.body._id, name: 'beer', quantity: 6 })

    const expectedOutput = {
      name: picnicName,
      location,
      date,
      attendees: [{ _id: armagan.body._id }],
      items: [{ name: 'beer', quantity: 9 }],
    }

    const actualOutput = await request(app)
      .put(`/picnics/${picnic.body._id}/items`)
      .send({ user: armagan.body._id, name: 'beer', quantity: 3 })

    expect(actualOutput.body).toMatchObject(expectedOutput)

    expect(actualOutput.body._id).toBeDefined()
  })

  it('can let multiple people bring the same item', async () => {
    const armagan = await request(app).post('/users').send({ name: 'Armagan' })
    const numan = await request(app).post('/users').send({ name: 'Numan' })

    const picnicName = "Numan's Counter-Picnic"
    const location = 'Hasenheide'
    const date = '2023-05-02'

    const picnic = await request(app).post('/picnics').send({ user: numan.body._id, name: picnicName, location, date })

    await request(app).post(`/picnics/${picnic.body._id}/attendees`).send({ user: armagan.body._id })

    const expectedOutput = {
      name: picnicName,
      location,
      date,
      attendees: [{ _id: numan.body._id }, { _id: armagan.body._id }],
      items: [{ name: 'beer', quantity: 9, desiredQuantity: 12 }],
    }

    await request(app)
      .put(`/picnics/${picnic.body._id}/items`)
      .send({ user: armagan.body._id, name: 'beer', quantity: 6 })

    const actualOutput = await request(app)
      .put(`/picnics/${picnic.body._id}/items`)
      .send({ user: numan.body._id, name: 'beer', quantity: 3, desiredQuantity: 12 })

    expect(actualOutput.body).toMatchObject(expectedOutput)

    expect(actualOutput.body._id).toBeDefined()
  })

  it('responds with 404 if the picnic is not found', async () => {
    const armagan = await request(app).post('/users').send({ name: 'Armagan' })

    const picnicName = "Armagan's Birthday Picnic"
    const location = 'Tempelhofer Feld'
    const date = '2023-05-01'

    await request(app).post('/picnics').send({ user: armagan.body._id, name: picnicName, location, date })

    const expectedOutput = {
      message: 'Picnic not found',
    }

    const actualOutput = await request(app).get('/picnics/6439611cbbecfcc5af0ed27c')

    expect(actualOutput.body).toMatchObject(expectedOutput)

    expect(actualOutput.status).toBe(404)
  })

  it('can let a user leave a picnic', async () => {
    const armagan = await request(app).post('/users').send({ name: 'Armagan' })
    const numan = await request(app).post('/users').send({ name: 'Numan' })

    const picnicName = "Armagan's Birthday Picnic"
    const location = 'Tempelhofer Feld'
    const date = '2023-05-01'

    const picnic = await request(app)
      .post('/picnics')
      .send({ user: armagan.body._id, name: picnicName, location, date })

    await request(app).post(`/picnics/${picnic.body._id}/attendees`).send({ user: numan.body._id })

    const expectedOutput = {
      name: picnicName,
      location,
      date,
      attendees: [{ _id: armagan.body._id }],
      items: [],
    }

    const actualOutput = await request(app)
      .delete(`/picnics/${picnic.body._id}/attendees`)
      .send({ user: numan.body._id })

    expect(actualOutput.body).toMatchObject(expectedOutput)

    expect(actualOutput.body._id).toBeDefined()

    const picnicAfterLeave = await request(app).get(`/picnics/${picnic.body._id}`)

    expect(picnicAfterLeave.body.attendees).toHaveLength(1)

    const numanAfterLeave = await request(app).get(`/users/${numan.body._id}`)
    expect(numanAfterLeave.body.picnics).toHaveLength(0)

    const armaganAfterLeave = await request(app).get(`/users/${armagan.body._id}`)

    expect(armaganAfterLeave.body.picnics).toHaveLength(1)

    expect(armaganAfterLeave.body.picnics[0]._id).toBe(picnic.body._id)

    expect(armaganAfterLeave.body.picnics[0].name).toBe(picnicName)

    expect(armaganAfterLeave.body.picnics[0].location).toBe(location)

    expect(armaganAfterLeave.body.picnics[0].date).toBe(date)

    expect(armaganAfterLeave.body.picnics[0].attendees).toHaveLength(1)

    expect(armaganAfterLeave.body.picnics[0].attendees[0]._id).toBe(armagan.body._id)

    expect(armaganAfterLeave.body.picnics[0].attendees[0].name).toBe('Armagan')

    expect(armaganAfterLeave.body.picnics[0].items).toHaveLength(0)
  })

  it('calculates the total quantity of an item right after someone leaves a picnic', async () => {
    const armagan = await request(app).post('/users').send({ name: 'Armagan' })
    const numan = await request(app).post('/users').send({ name: 'Numan' })

    const picnicName = "Armagan's Birthday Picnic"
    const location = 'Tempelhofer Feld'
    const date = '2023-05-01'

    const picnic = await request(app)
      .post('/picnics')
      .send({ user: armagan.body._id, name: picnicName, location, date })

    await request(app).post(`/picnics/${picnic.body._id}/attendees`).send({ user: numan.body._id })

    await request(app)
      .put(`/picnics/${picnic.body._id}/items`)
      .send({ user: armagan.body._id, name: 'beer', quantity: 6 })

    await request(app)
      .put(`/picnics/${picnic.body._id}/items`)
      .send({ user: numan.body._id, name: 'beer', quantity: 3, desiredQuantity: 12 })

    const expectedOutput = {
      name: picnicName,
      location,
      date,
      attendees: [{ _id: armagan.body._id }],
      items: [{ name: 'beer', quantity: 6 }],
    }

    const actualOutput = await request(app)
      .delete(`/picnics/${picnic.body._id}/attendees`)
      .send({ user: numan.body._id })

    expect(actualOutput.body).toMatchObject(expectedOutput)

    expect(actualOutput.body._id).toBeDefined()

    const picnicAfterLeave = await request(app).get(`/picnics/${picnic.body._id}`)

    expect(picnicAfterLeave.body.items).toHaveLength(1)

    expect(picnicAfterLeave.body.items[0].name).toBe('beer')

    expect(picnicAfterLeave.body.items[0].quantity).toBe(6)

    expect(picnicAfterLeave.body.items[0].desiredQuantity).toBe(12)
  })

  it('can retrieve a list of users', async () => {
    const armagan = await request(app).post('/users').send({ name: 'Armagan' })
    const numan = await request(app).post('/users').send({ name: 'Numan' })

    const expectedOutput = [
      { _id: armagan.body._id, name: 'Armagan' },
      { _id: numan.body._id, name: 'Numan' },
    ]

    const actualOutput = await request(app).get('/users')

    expect(actualOutput.body).toMatchObject(expectedOutput)
  })

  it('returns 404 if the user is not found', async () => {
    const expectedOutput = {
      message: 'User not found',
    }

    const actualOutput = await request(app).get('/users/6439611cbbecfcc5af0ed27c')

    expect(actualOutput.body).toMatchObject(expectedOutput)

    expect(actualOutput.status).toBe(404)
  })

  it('returns a list of picnics', async () => {
    const armagan = await request(app).post('/users').send({ name: 'Armagan' })
    const numan = await request(app).post('/users').send({ name: 'Numan' })

    const picnicName = "Armagan's Birthday Picnic"
    const location = 'Tempelhofer Feld'
    const date = '2023-05-01'

    const picnic = await request(app)
      .post('/picnics')
      .send({ user: armagan.body._id, name: picnicName, location, date })

    await request(app).post(`/picnics/${picnic.body._id}/attendees`).send({ user: numan.body._id })

    const expectedOutput = [
      {
        _id: picnic.body._id,
        name: picnicName,
        location,
        date,
        attendees: [{ _id: armagan.body._id }, { _id: numan.body._id }],
        items: [],
      },
    ]

    const actualOutput = await request(app).get('/picnics')

    expect(actualOutput.body).toMatchObject(expectedOutput)
  })

  it('returns 404 for an unknown url', async () => {
    const expectedOutput = {
      message: 'Not Found',
    }

    const actualOutput = await request(app).get('/unknown')

    expect(actualOutput.body).toMatchObject(expectedOutput)

    expect(actualOutput.status).toBe(404)
  })

  it('rejects user creation if the name is missing', async () => {
    const expectedOutput = {
      message: 'User validation failed: name: Path `name` is required.',
    }

    const actualOutput = await request(app).post('/users').send({})

    expect(actualOutput.body).toMatchObject(expectedOutput)

    expect(actualOutput.status).toBe(500)
  })
})
