var gIo = null

function setupSocketAPI(http) {
    gIo = require('socket.io')(http, {
        cors: {
            origin: '*',
        }
    })
    gIo.on('connection', socket => {
        socket.on('disconnect', socket => {
            console.log(`Socket disconnected [id: ${socket.id}]`)
        })
        socket.on('chat-set-topic', topic => {
            if (socket.toyId === toyId) return
            if (socket.toyId) {
                socket.leave(socket.toyId)
                console.log(`Socket is leaving topic ${socket.toyId} [id: ${socket.id}]`)
            }
            socket.join(toyId)
            socket.toyId = toyId
        })
        socket.on('chat-send-msg', msg => {
            console.log(`New chat msg from socket [id: ${socket.id}], emitting to topic ${socket.myTopic}`)
            // emits to all sockets:
            // gIo.emit('chat addMsg', msg)
            // emits only to sockets in the same room
            gIo.to(socket.toyId).emit('chat-add-msg', msg)
        })
        socket.on('user-watch', userId => {
            console.log(`user-watch from socket [id: ${socket.id}], on user ${userId}`)
            socket.join('watching:' + userId)

        })
        socket.on('set-user-socket', userId => {
            console.log(`Setting socket.userId = ${userId} for socket [id: ${socket.id}]`)
            socket.userId = userId
        })
        socket.on('unset-user-socket', () => {
            console.log(`Removing socket.userId for socket [id: ${socket.id}]`)
            delete socket.userId
        })

    })
}

function emitTo({ type, data, label }) {
    if (label) gIo.to('watching:' + label.toString()).emit(type, data)
    else gIo.emit(type, data)
}

async function emitToUser({ type, data, userId }) {
    userId = userId?.toString()
    const socket = await _getUserSocket(userId)

    if (socket) {
        console.log(`Emiting event: ${type} to user: ${userId} socket [id: ${socket.id}]`)
        socket.emit(type, data)
    } else {
        console.log(`No active socket for user: ${userId}`)
        // _printSockets()
    }
}

// If possible, send to all sockets BUT not the current socket 
// Optionally, broadcast to a room / to all
async function broadcast({ type, data, room = null, userId }) {
    userId = userId?.toString()

    const excludedSocket = await _getUserSocket(userId)
    if (room && excludedSocket) {
        console.log(`Broadcast to room ${room} excluding user: ${userId}`)
        excludedSocket.broadcast.to(room).emit(type, data)
    } else if (excludedSocket) {
        console.log(`Broadcast to all excluding user: ${userId}`)
        excludedSocket.broadcast.emit(type, data)
    } else if (room) {
        console.log(`Emit to room: ${room}`)
        gIo.to(room).emit(type, data)
    } else {
        console.log(`Emit to all`)
        gIo.emit(type, data)
    }
}

async function _getUserSocket(userId) {
    const sockets = await _getAllSockets()
    const socket = sockets.find(s => s.userId === userId)
    return socket
}
async function _getAllSockets() {
    // return all Socket instances
    const sockets = await gIo.fetchSockets()
    return sockets
}

async function _printSockets() {
    const sockets = await _getAllSockets()
    console.log(`Sockets: (count: ${sockets.length}):`)
    sockets.forEach(_printSocket)
}
function _printSocket(socket) {
    console.log(`Socket - socketId: ${socket.id} userId: ${socket.userId}`)
}

module.exports = {
    // set up the sockets service and define the API
    setupSocketAPI,
    // emit to everyone / everyone in a specific room (label)
    emitTo,
    // emit to a specific user (if currently active in system)
    emitToUser,
    // Send to all sockets BUT not the current socket - if found
    // (otherwise broadcast to a room / to all)
    broadcast,
}
