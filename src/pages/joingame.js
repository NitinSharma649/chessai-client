import React, {useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {mySocketId, socket} from "../socket-connection";
import {useDispatch, useSelector} from "react-redux";
import {PLAY_GAME, SET_COLOR} from "../redux/action_types/action_types";

/**
 * 'Join game' is where we actually join the game room.
 */


const JoinGameRoom = (gameid, userName, isCreator) => {
    /**
     * For this browser instance, we want
     * to join it to a gameRoom. For now
     * assume that the game room exists
     * on the backend.
     *
     *
     * TODO: handle the case when the game room doesn't exist.
     */
    const idData = {
        gameId : gameid,
        userName : userName,
        isCreator: isCreator
    }

    console.log("calling conce");
    socket.emit("playerJoinGame", idData)
    console.log(2)
}


const JoinGame = (props) => {
    const dispatch = useDispatch();
    const {username, gameId, isConnectedGame} = useSelector(state => ({
        username: state.userReducer.username,
        gameId: state.userReducer.gameId,
        isConnectedGame: state.userReducer.isConnectedGame
    }));
    /**
     * Extract the 'gameId' from the URL.
     * the 'gameId' is the gameRoom ID.
     */
    console.log("cjesdf")
    const { gameid } = useParams()
    // useEffect(() =>{
    //     if(!isConnectedGame && gameId==null) {
    //         dispatch({
    //             type: PLAY_GAME,
    //             payload: {
    //                 isConnectedGame: true,
    //                 gameId: gameid
    //             }
    //         });
    //         console.log(isConnectedGame)
    //         JoinGameRoom(gameid, username, props.isCreator)
    //     }
    // }, [isConnectedGame])

    JoinGameRoom(gameid, props.userName, props.isCreator)
    return (<></>)
}

export default JoinGame

