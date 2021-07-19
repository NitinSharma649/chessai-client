import React, {useEffect, useState} from 'react';
import Chess from 'chess.js';
import Chessboard from "../src/Chessboard";
import {mySocketId, socket} from "../socket-connection";
import {ColorContext} from "../context/colorcontext";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {SET_COLOR} from "../redux/action_types/action_types";
import VideoChatApp from "../connection/videochat";

function PVC({gameId, color, children, setGameContext, whenPieceMoved, onGameOver, socketId}) {
    const [fen, setFen] = useState('start');
    const [squareStyles, setSquareStyles] = useState({});
    const [pieceSquare, setPieceSquare] = useState('');
    const [game, setGame] = useState(new Chess());
    const [currentPosition, setCurrentPosition] = useState(() => {
    });

    const {username, userColor, userId} = useSelector(state => ({
        username: state.userReducer.username,
        userColor: state.userReducer.color,
        userId: state.userReducer.userid
    }));

    useEffect(() => {
        // !color ?: game.setTurn("w")

        socket.on('opponent move', move => {
            // if(!game) setGame(new Chess(move.fen));
            console.log(move);
            console.log("onOpponentMove");
            // move == [pieceId, finalPosition]
            // console.log("opponenet's move: " + move.selectedId + ", " + move.finalPosition)
            if (move.playerColorThatJustMovedIsWhite !== color) {
                // debugger
                // console.log(move, Object.keys(game));
                console.log(color + " just moved")
                if (game) {
                    game.move(move.move);
                    // game.fen(move.fen)
                }
                ;
                setFen(move.fen);
                // whenPieceMoved(game.history({verbose: true}));
            }
        })
    }, []);

    useEffect(() => {
        if(userId && gameId && userColor && socketId && username) {
            socket.emit("gameHistory", {
                userId,
                gameId,
                color: userColor,
                socketId,
                username
            });
        }
    }, [userId, gameId, userColor, socketId, username]);

    const onDrop = ({sourceSquare, targetSquare}) => {

        let move = {
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q'
        };
        var moved = game.move(move);

        // illegal move
        if (moved === null) return;

        setFen(game.fen());
        whenPieceMoved(game.history({verbose: true}));

        socket.emit('new move', {
            nextPlayerColorToMove: !color,
            playerColorThatJustMovedIsWhite: color,
            gameId: gameId,
            move: move,
            fen: game.fen()
        })
    };

    const onSquareClick = square => {
        setSquareStyles({[square]: {backgroundColor: 'DarkTurquoise'}});
        setPieceSquare(square);

        let move = game.move({
            from: pieceSquare,
            to: square,
            promotion: 'q' // always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) return;

        setFen(game.fen());
        whenPieceMoved(game.history({verbose: true}));
        // window.setTimeout(makeComputerMove, 1000);
    }

    return (
        <Chessboard
            calcWidth={({screenWidth}) => (screenWidth < 500 ? 350 : 480)}
            showErrors={console}
            id="humanVsComputer"
            position={fen}
            onDrop={(e) => onDrop(e) && console.log(e)}
            boardStyle={{
                borderRadius: '5px',
                boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
            }}
            onSquareClick={onSquareClick}
            squareStyles={squareStyles}
            orientation={color ? 'white' : 'black'}
        />
    );
}

const OneToOneChess = (props) => {

    const domainName = process.env.REACT_APP_BASE_URL || "http://localhost:3000"
    const color = React.useContext(ColorContext)
    const {gameid} = useParams()
    const [opponentSocketId, setOpponentSocketId] = React.useState('')
    const [opponentDidJoinTheGame, didJoinGame] = React.useState(false)
    const [opponentUserName, setUserName] = React.useState('')
    const [gameSessionDoesNotExist, doesntExist] = React.useState(false)
    const [playerColor, setPlayerColor] = useState('green');
    const [computerColor, setComputerColor] = useState('red');
    const [movesList, setMovesList] = useState([]);
    const dispatch = useDispatch();
    const {username, userColor, isConnectedGame} = useSelector(state => ({
        username: state.userReducer.username,
        userColor: state.userReducer.color,
        isConnectedGame: state.userReducer.isConnectedGame
    }));
    if (userColor != "w" && userColor == null) {
        dispatch({
            type: SET_COLOR,
            payload: {
                color: "b"
            }
        });
    }
    console.log(userColor);

    React.useEffect(() => {
        console.log(mySocketId)

        socket.on("playerJoinedRoom", statusUpdate => {
            console.log("playerJoinedRoom called");
            console.log("A new player has joined the room! Username: " + statusUpdate.userName + ", Game id: " + statusUpdate.gameId + " Socket id: " + statusUpdate.mySocketId)
            if (socket.id !== statusUpdate.mySocketId) {
                console.log(11);
                setOpponentSocketId(statusUpdate.mySocketId)
            }
        })


        socket.on("status", statusUpdate => {
            console.log("chessStatusUpdate");
            console.log(statusUpdate)
            if (statusUpdate === 'This game session does not exist.' || statusUpdate === 'There are already 2 people playing in this room.') {
                console.log(12);
                doesntExist(true)
            }
        })


        socket.on('start game', (opponentUserName) => {
            console.log("chessGameStarted")
            console.log(opponentUserName, username)
            if (opponentUserName !== username) {
                console.log(13);
                setUserName(opponentUserName)
                didJoinGame(true)
            } else {
                // in chessGame, pass opponentUserName as a prop and label it as the enemy.
                // in chessGame, use reactContext to get your own userName
                // socket.emit('myUserName')
                console.log(14);
                socket.emit('request username', gameid)
            }
        })


        socket.on('give userName', (socketId) => {
            console.log("settingChessUsername");
            if (socket.id !== socketId) {

                console.log(15);
                console.log("give userName stage: " + username)
                socket.emit('recieved userName', {userName: username, gameId: gameid})
            }
        })

        socket.on('get Opponent UserName', (data) => {
            console.log("settingChessOpponentName");
            if (socket.id !== data.socketId && data.userName != username) {
                setUserName(data.userName)
                console.log(16);
                console.log(props, socket, data)
                setOpponentSocketId(data.socketId)

                didJoinGame(true)
            }
        })
    }, [])

    return (
        <React.Fragment>
            {opponentDidJoinTheGame ? (
                <div>
                    <h4> Opponent: </h4>
                    <div style={{display: "flex"}}>
                        <PVC whenPieceMoved={setMovesList}
                             onGameOver={() => alert("Game Over!")}
                             gameId={gameid}
                             color={userColor == "w" ? true : false}
                             socketId={socket.id}
                        />
                        <VideoChatApp
                            mySocketId={socket.id}
                            opponentSocketId={opponentSocketId}
                            myUserName={username}
                            opponentUserName={opponentUserName}
                        />
                    </div>
                    <h4> You: {username} </h4>
                </div>
            ) : gameSessionDoesNotExist ? (
                <div>
                    <h1 style={{textAlign: "center", marginTop: "200px"}}> :( </h1>
                </div>
            ) : (
                <div>
                    <h1
                        style={{
                            textAlign: "center",
                            marginTop: String(window.innerHeight / 8) + "px",
                        }}
                    >
                        Hey <strong>{username}</strong>, copy and paste the URL
                        below to send to your friend:
                    </h1>
                    <textarea
                        style={{
                            marginLeft: String((window.innerWidth / 2) - 290) + "px",
                            marginTop: "30" + "px",
                            width: "580px",
                            height: "30px"
                        }}
                        onFocus={(event) => {
                            console.log('sd')
                            event.target.select()
                        }}
                        value={domainName + "/game/" + gameid}
                        type="text">
              </textarea>
                    <br></br>

                    <h1 style={{textAlign: "center", marginTop: "100px"}}>
                        {" "}
                        Waiting for other opponent to join the game...{" "}
                    </h1>
                </div>
            )}
        </React.Fragment>
    )
}

export default OneToOneChess
