import React, {useState} from "react";
import Login from "./Login";
import SignUp from "./SignUp";
import {BrowserRouter, Link, Route as MainRoute, Switch, Redirect, useHistory} from "react-router-dom";
import PlayGame from "./PlayGame";
import OneToOneChess from "./OneToOneChess";
import PlayerVsComputer from "./PlayerVsComputer";
import RoutesList from "../RoutesList";
import JoinGame from "./joingame";
import JoinRoom from "./joinroom";
import {ColorContext} from "../context/colorcontext";
import {useDispatch, useSelector} from "react-redux";
import {LOGOUT} from "../redux/action_types/action_types";

export default function WelcomeScreen() {
    const {signedIn, username, didRedirect} = useSelector(state=>({
        signedIn: state.userReducer.token,
        username: state.userReducer.username,
        didRedirect: state.userReducer.didRedirect
    }));
    const dispatch = useDispatch();

    function logout(){
        dispatch({
            type: LOGOUT,
        })
    }

    console.log(process.env)
    return (
        <div style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <ColorContext.Provider value={{
                didRedirect: didRedirect
            }}>
                <BrowserRouter>
                    <div className="App"
                         style={{
                             width: '100%',
                             display: 'flex',
                             flex: 1,
                             alignItems: 'center',
                             justifyContent: 'center'
                         }}>
                        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
                            <div className="container">
                                <Link className="navbar-brand" to={"/"}>ChessAI</Link>
                                <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                                    <ul className="navbar-nav ml-auto">
                                        {!signedIn && <>
                                            <li className="nav-item">
                                                <Link className="nav-link" to={RoutesList.login}>Login</Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link className="nav-link" to={RoutesList.signup}>Sign up</Link>
                                            </li>
                                        </>}
                                        {signedIn && <>
                                            <li className="nav-item">
                                                <Link className="nav-link" to={RoutesList.playgame}>Play</Link>
                                            </li>
                                            <li className="nav-item">
                                                <span style={{cursor: 'pointer'}} className="nav-link" onClick={logout}  >Logout</span>
                                            </li>
                                        </>}
                                    </ul>
                                </div>
                            </div>
                        </nav>

                        <Switch>
                            <Route exact path='/' component={Login}/>
                            <Route path={RoutesList.login} component={Login}/>
                            <Route path={RoutesList.signup} component={SignUp}/>
                            <>
                            <Route path ={RoutesList.playgame}  private={true} component={()=><PlayGame setUserName={()=>{}}/>}/>
                                {/*<PlayGame setUserName = {setUserName}/>*/}

                            <Route path={RoutesList.onevsone}  private={true}>
                                {
                                    didRedirect ?
                                    <React.Fragment>
                                        <JoinGame userName={username} isCreator={true}/>
                                        <OneToOneChess userName={username}/>
                                    </React.Fragment>
                                    :
                                    <JoinRoom/>}
                            </Route>
                            {/*<Route path={} component={OneToOneChess}/>*/}
                            <Route path={RoutesList.playervscomputer} component={PlayerVsComputer} private={true}/>
                            </>
                        </Switch>

                    </div>
                </BrowserRouter>
            </ColorContext.Provider>
        </div>
    )
}

function getQueryParam(param) {
    var rx = new RegExp("[?&]" + param + "=([^&]+).*$");
    var returnVal = window.location.search.match(rx);
    return returnVal === null ? "" : returnVal[1];
}

function Route(props){
    const {token, userid} = useSelector(state=>({
        userid: state.userReducer.userid,
        token: state.userReducer.token,
    }))
    console.log(token)
    const redirectAfter = window.location.href;
    const history = useHistory();
    if(props.private){
        if(token){

        } else{
            return <Redirect to={RoutesList.login+"?redir="+redirectAfter} />
        }
    } else {
        if(token){
            const redirection = getQueryParam("redir");
            const gameId = redirection.split('/').reverse()[0];
            if(gameId && gameId != 'playgame') history.push(`/game/${gameId}`);
            else return <Redirect to={RoutesList.playgame} />;
            // if(redirection) window.location.href = redirection;
        }
    }
    return <MainRoute {...props}  />;
}
