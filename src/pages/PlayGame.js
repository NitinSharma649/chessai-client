import React, {useState} from "react";
import OnevsOne from '../assets/images/1v1.jpg';
import VsComputer from '../assets/images/vsComputer.jpg';
import {Link, Redirect, useHistory} from "react-router-dom";
import RoutesList from "../RoutesList";
import {socket} from "../socket-connection";
import * as uuid from 'uuid'
import {useDispatch, useSelector} from "react-redux";
import {PLAY_GAME, SET_COLOR, SET_DID_REDIRECT} from "../redux/action_types/action_types";


function PlayGame(props) {
    const [gameId, setGameId] = useState();
    const history = useHistory();
    const dispatch = useDispatch();
    const {username} = useSelector(state => ({
        username: state.userReducer.username,
    }));

    console.log("testsdf")
    // console.log(this.props)

    const send = () => {
        dispatch({
            type: SET_COLOR,
            payload: {
                color: "w"
            }
        });

        dispatch({
            type: SET_DID_REDIRECT,
            payload: {
                didRedirect: true
            }
        });
        /**
         * This method should create a new room in the '/' namespace
         * with a unique identifier.
         */
        const newGameRoomId = uuid.v4()

        // set the state of this component with the gameId so that we can
        // redirect the user to that URL later.

        setGameId(newGameRoomId);

        // emit an event to the server to create a new room
        socket.emit('createNewGame', newGameRoomId)

        console.log(1)
        history.push(`/game/${newGameRoomId}`);
    }


    return (<React.Fragment>
            {
                <div style={{backgroundColor: 'white', padding: 20, borderRadius: 10}}>
                    <h1 style={{textAlign: 'center'}}>How you want to play?</h1>
                    <div style={{display: 'flex'}}>
                        <div className="card" style={{width: "18rem", marginRight: 40}}>
                            <img className="card-img-top" height={200} src={OnevsOne} alt="Card image cap"/>
                            <div className="card-body">
                                <h5 className="card-title">Versus Mode</h5>
                                <p className="card-text">Play against your friend online</p>
                                {/*<Link to={RoutesList.onevsone}>*/}
                                {/*    <a className="btn btn-primary">Play Online</a>*/}
                                {/*</Link>*/}
                                <button className="btn btn-primary"
                                        onClick={() => {
                                            send()
                                        }}>Play Now
                                </button>
                            </div>
                        </div>
                        <div className="card" style={{width: "18rem"}}>
                            <img className="card-img-top" height={200} src={VsComputer} alt="Card image cap"/>
                            <div className="card-body">
                                <h5 className="card-title">Computer Mode</h5>
                                <p className="card-text">Play against computer</p>
                                <Link to={RoutesList.playervscomputer}>
                                    <a className="btn btn-primary">Play with Computer</a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </React.Fragment>
    );
}

export default PlayGame