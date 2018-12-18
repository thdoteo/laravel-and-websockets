let io = require('socket.io')(3000)
let jwt = require('jsonwebtoken')

let users = []

io.on('connection', socket => {
    let currentUser = null

    socket.on('identify', ({token}) => {
        try {
            let decoded = jwt.verify(token, 'demo', {
                algorithms: ['HS256']
            })
            currentUser = {
                id: decoded.user_id,
                name: decoded.user_name,
                nbConnections: 1
            }

            let user = users.find(u => u.id === currentUser.id)
            if(!user) {
                users.push(currentUser)
                socket.broadcast.emit('users.connection', {user: currentUser})
            }
            else {
                user.nbConnections++
            }
            socket.emit('users.list', {users})
        } catch(e) {
            console.error(e.error)
        }
    })

    socket.on('disconnect', () => {
        if(currentUser) {
            let user = users.find(u => u.id === currentUser.id)
            if(user) {
                user.nbConnections--
                if(user.nbConnections === 0)
                {
                    users = users.filter(u => u.id !== currentUser.id)
                    socket.broadcast.emit('users.disconnection', {user: currentUser})
                }
            }
        }
    })
})
