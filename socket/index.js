const io = require('socket.io')(8080, {
    cors: {
        origin: ['http://localhost:3000']
    }
});
let usersConnected = new Map();
const getCurrentUser = (socketId) => {
    console.log(socketId);
    for(let [key, value] of usersConnected) {
        if(value===socketId) return key;
    }
}
io.on('connect', (socket) => {
    console.log(socket.id);
    socket.on('add-user', (username, socketId) => {
        usersConnected.set(username, socketId);
        console.log(usersConnected);
        socket.emit('new-user-connected', usersConnected);
        console.log("adding user");
    });
    socket.on('disconnectUser', (username) => {
        if(usersConnected.has(username))
        usersConnected.delete(username);
        console.log("number of connected users: " + usersConnected.size);
    });
    socket.on('send-message', (message, toUser) => {
        if(!usersConnected.has(toUser)) return;
        const userSocketId=usersConnected.get(toUser);
        const fromUser=getCurrentUser(socket.id);
        console.log(fromUser + "has send message to " + toUser);
        socket.to(userSocketId).emit('receive-message', message, fromUser);
        console.log("number of users: " + usersConnected.size);
    });
});
