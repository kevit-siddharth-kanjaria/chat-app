//users array
const users = []

//add user
const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return {
            error: 'Username and Room required!'
        }
    }

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if (existingUser) {
        return {
            error: 'Username is taken'
        }
    }

    const user = { id, username, room }
    users.push(user)
    return { user }
}

//remove user
const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

//user details getter
const getUser = (id) => {
    return users.find((user) => user.id === id)
}

//userlist getter
const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
}

//export user functions
module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}