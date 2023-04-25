import { defineStore } from 'pinia'
import { io } from 'socket.io-client'

export const socket = io('http://localhost:3000', {
  withCredentials: true
})

export const useSocketStore = defineStore('Socket', {
  state: () => ({
    connected: false,
    time: null
  }),
  actions: {
    init() {
      socket.on('connect', () => {
        this.connected = true
        console.log('connected')
      })

      socket.on('disconnect', () => {
        this.connected = false
        console.log('disconnected')
      })

      socket.on('time', (time) => {
        this.time = time
      })
    }
  }
})
