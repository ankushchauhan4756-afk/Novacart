import { io } from 'socket.io-client'

let socket = null

const getSocketUrl = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:5000'
  }
  return window.location.origin
}

export const connectSocket = (userId) => {
  if (!socket) {
    socket = io(getSocketUrl(), {
      autoConnect: false,
      transports: ['websocket'],
    })

    socket.on('connect', () => {
      console.log('[Socket] connected', socket.id)
      if (userId) {
        socket.emit('joinUser', { userId })
      }
    })

    socket.on('disconnect', () => {
      console.log('[Socket] disconnected')
    })
  }

  if (userId) {
    socket.auth = { token: localStorage.getItem('token') }
    if (socket.connected) {
      socket.emit('joinUser', { userId })
    }
  }

  if (!socket.connected) {
    socket.connect()
  }

  return socket
}

export const subscribeToOrderStatus = (callback) => {
  if (!socket) return () => {}
  socket.on('orderStatusUpdated', callback)
  return () => {
    socket.off('orderStatusUpdated', callback)
  }
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
