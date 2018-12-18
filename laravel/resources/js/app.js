require('./bootstrap');

import io from 'socket.io-client'

let presence = document.querySelector('#websockets')

let addUser = (user) =>
{
    let li = document.createElement('li')
    li.innerText = user.name
    li.id = 'user' + user.id
    presence.appendChild(li)
}

if(presence)
{
    let socket = io('http://localhost:3000')
    socket.on('connect', () => {
        socket.emit('identify', {
            token: presence.dataset.token
        })
    })

    socket.on('users.connection', ({user}) => addUser(user));

    socket.on('users.list', ({users}) => {
        for(let u in users)
        {
            addUser(users[u]);
        }
    })

    socket.on('users.disconnection', ({user}) => {
        presence.removeChild(document.querySelector('#user' + user.id))
    })
}
