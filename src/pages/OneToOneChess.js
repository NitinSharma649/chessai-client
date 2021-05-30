import React, {Component, useSound, useState, useEffect} from 'react';
import Chess from 'chess.js';
import Chessboard from "../src/Chessboard";
import MoveCalculation from "../models/MoveCalculation";
import {socket, mySocketId} from "../socket-connection";
import {ColorContext} from "../context/colorcontext";
import {useParams} from "react-router-dom";

function PVC({gameId, color, children, setGameContext, whenPieceMoved, onGameOver}) {
    const [fen, setFen] = useState('start');
    const [squareStyles, setSquareStyles] = useState({});
    const [pieceSquare, setPieceSquare] = useState('');
    const [game, setGame] = useState(null);
    const [currentPosition, setCurrentPosition] = useState(() => {
    });

    useEffect(() => {
        setGame(new Chess());

        socket.on('opponent move', move => {
            if(!game) setGame(new Chess(move.fen));
            console.log("onOpponentMove");
            // move == [pieceId, finalPosition]
            // console.log("opponenet's move: " + move.selectedId + ", " + move.finalPosition)
            if (move.playerColorThatJustMovedIsWhite !== color) {
                // debugger
                // console.log(move, Object.keys(game));
            console.log(color + " just moved")
                if(game){
                    game.move(move.move);
                    // game.fen(move.fen)
                };
                setFen(move.fen);
                // whenPieceMoved(game.history({verbose: true}));
            }
        })
    }, []);

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
            orientation={ color ? 'white' : 'black'}
        />
    );
}

const OneToOneChess = (props) => {

    const domainName = "https://chessai-fn9l.onrender.com"
    const color = React.useContext(ColorContext)
    const {gameid} = useParams()
    const [opponentSocketId, setOpponentSocketId] = React.useState('')
    const [opponentDidJoinTheGame, didJoinGame] = React.useState(false)
    const [opponentUserName, setUserName] = React.useState('')
    const [gameSessionDoesNotExist, doesntExist] = React.useState(false)
    const [playerColor, setPlayerColor] = useState('green');
    const [computerColor, setComputerColor] = useState('red');
    const [movesList, setMovesList] = useState([]);

    React.useEffect(() => {
        console.log(mySocketId)
        socket.on("playerJoinedRoom", statusUpdate => {
            console.log("playerJoinedRoom called");
            console.log("A new player has joined the room! Username: " + statusUpdate.userName + ", Game id: " + statusUpdate.gameId + " Socket id: " + statusUpdate.mySocketId)
            if (socket.id !== statusUpdate.mySocketId) {
                setOpponentSocketId(statusUpdate.mySocketId)
            }
        })


        socket.on("status", statusUpdate => {
            console.log("chessStatusUpdate");
            console.log(statusUpdate)
            alert(statusUpdate)
            if (statusUpdate === 'This game session does not exist.' || statusUpdate === 'There are already 2 people playing in this room.') {
                doesntExist(true)
            }
        })


        socket.on('start game', (opponentUserName) => {
            console.log("chessGameStarted")
            if (opponentUserName !== props.userName) {
                setUserName(opponentUserName)
                didJoinGame(true)
            } else {
                // in chessGame, pass opponentUserName as a prop and label it as the enemy.
                // in chessGame, use reactContext to get your own userName
                // socket.emit('myUserName')
                socket.emit('request username', gameid)
            }
        })


        socket.on('give userName', (socketId) => {
            console.log("settingChessUsername");
            if (socket.id !== socketId) {
                console.log("give userName stage: " + props.userName)
                socket.emit('recieved userName', {userName: props.userName, gameId: gameid})
            }
        })

        socket.on('get Opponent UserName', (data) => {
            console.log("settingChessOpponentName");
            if (socket.id !== data.socketId) {
                setUserName(data.userName)
                console.log('data.socketId: data.socketId')
                setOpponentSocketId(data.socketId)
                didJoinGame(true)
            }
        })
    }, [mySocketId])

    return (
        <React.Fragment>
            {opponentDidJoinTheGame ? (
                <div>
                    <h4> Opponent: {opponentUserName} </h4>
                    <div style={{display: "flex"}}>
                        <PVC whenPieceMoved={setMovesList}
                             onGameOver={() => alert("Game Over!")}
                             gameId={gameid}
                             color={color.didRedirect}
                        />
                    </div>
                    <h4> You: {props.userName} </h4>
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
                        Hey <strong>{props.userName}</strong>, copy and paste the URL
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
