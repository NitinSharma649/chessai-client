import io from 'socket.io-client'

const URL = process.env.REACT_APP_API_BASE_URL

// register preliminary event listeners here:
const socket = io(URL)
global.myGameSocket = socket;
var mySocketId
// register preliminary event listeners here:

socket.on("createNewGame", statusUpdate => {
    console.log(statusUpdate);
    console.log("A new game has been created! Game id: " + statusUpdate.gameId + " Socket id: " + statusUpdate.mySocketId )
    mySocketId = statusUpdate.mySocketId
})

export {
    socket,
    mySocketId
}
