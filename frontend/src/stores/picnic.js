import { defineStore } from 'pinia'
import axios from 'axios'
import { socket } from './socket'

export const usePicnicStore = defineStore('Picnic', {
  state: () => ({
    picnic: null
  }),
  actions: {
    async fetchPicnic(id) {
      this.picnic = (await axios.get('/picnics/' + id)).data
    },
    async createPicnic(name, location, date, description) {
      return (
        await axios.post('/picnics', {
          name: name,
          location: location,
          date: date,
          description: description
        })
      ).data
    },
    async bringItem(picnicId, name, userId, quantity = 1) {
      return (
        await axios.put('/picnics/' + picnicId + '/items', {
          user: userId,
          name: name,
          quantity: quantity
        })
      ).data
    },
    async joinPicnic(picnicId) {
      socket.emit('join picnic', picnicId)

      socket.on('someone brought an item', (picnic) => {
        this.picnic = picnic
      })
    },
    async leavePicnic(picnicId) {
      socket.emit('leave picnic', picnicId)

      socket.off('someone brought an item')
    }
  }
})
