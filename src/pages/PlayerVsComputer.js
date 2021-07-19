import {useEffect, useState} from 'react';
import Chess from 'chess.js';
import Chessboard from "../src/Chessboard";
import MoveCalculation from "../models/MoveCalculation";
import {useSelector} from "react-redux";

const $ = window.$;

function PVC({children, setGameContext, whenPieceMoved, onGameOver}) {
    const [fen, setFen] = useState('start');
    const [squareStyles, setSquareStyles] = useState({});
    const [pieceSquare, setPieceSquare] = useState('');
    const [game, setGame] = useState(null);
    const [currentPosition, setCurrentPosition] = useState(() => {
    });

    useEffect(() => {
        setGame(new Chess());
    }, []);


    const makeComputerMove = () => {
        MoveCalculation(null, null, onGameOver).makeBestMove(game, setFen);
        whenPieceMoved(game.history({verbose: true}));
    };

    const onDrop = ({sourceSquare, targetSquare}) => {
        var move = game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q'
        });

        // illegal move
        if (move === null) return;

        setFen(game.fen());
        whenPieceMoved(game.history({verbose: true}));
        window.setTimeout(makeComputerMove, 1000);
        return true;
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
        window.setTimeout(makeComputerMove, 1000);
        console.log("sets");
    };

    return (
        <Chessboard
            calcWidth={({screenWidth}) => (screenWidth < 500 ? 350 : 480)}
            id="humanVsComputer"
            position={fen}
            onDrop={(e) => onDrop(e) && console.log(e)}
            boardStyle={{
                borderRadius: '5px',
                boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
            }}
            onSquareClick={onSquareClick}
            squareStyles={squareStyles}
        />
    );
}

export default function PlayerVsComputer() {
    const user = useSelector(state=>state.userReducer.username);
    const [playerColor, setPlayerColor] = useState('green');
    const [computerColor, setComputerColor] = useState('red');
    const [movesList, setMovesList] = useState([]);
    return (
        <div style={{display: 'flex'}}>
            <div style={{backgroundColor: 'white', padding: 20, borderRadius: 10}}>
                <h5 style={{color: playerColor}}>{user} <span style={{color: 'black'}}>V/s</span> <span
                    style={{color: computerColor}}>Computer</span></h5>
                <PVC whenPieceMoved={setMovesList} onGameOver={() => alert("Game Over!")}>

                </PVC>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: 552,
                minWidth: '40%',
                marginLeft: 10,
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 10
            }}>
                <h4 style={{}}>Moves List</h4>
                {/*<hr/>*/}
                <div style={{overflowY: 'auto', flexGrow: 1}}>
                    {/*<ul>*/}
                    {movesList.map(m => (
                        <div><span
                            style={{color: m.color == "w" ? playerColor : computerColor}}>{m.color == "w" ? user : "Computer"}</span>: {m.from} -> {m.to}
                        </div>
                    ))}
                    {/*{new Array(20).fill(null).map(h=><div>hello</div>)}*/}
                    {/*{movesList?.map(m=><li>{m}</li>)}*/}
                    {/*</ul>*/}
                </div>
            </div>
        </div>
    );
}
