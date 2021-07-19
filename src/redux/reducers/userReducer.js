import {INVITE_PLAYER, INVITED, LOGIN, LOGOUT, PLAY_GAME, SET_COLOR, SET_DID_REDIRECT} from "../action_types/action_types";

const initialState = {
    email: null,
    token: null,
    username: null,
    userid: null,
    color: null,
    gameId: null,
    isConnectedGame:false,
    didRedirect: false
}

export default function (state = initialState, {payload, type = "DEFAULT"}){
    switch (type){
        case LOGIN: {
            return {
                ...state, userid: (payload?. userId) || null, token: (payload?. token) || null,
                username: (payload?. username) || null, email: (payload?. email) || null
            }
        };
        break;
        case LOGOUT: {
            return initialState;
        };
        break;
        case PLAY_GAME: {
            return {
                ...state,
                gameId: (payload?. gameId),
                isConnectedGame: (payload?. isConnectedGame)
            }
        }
        break;
        case INVITE_PLAYER: {
            return {
                ...state
            }
        }
        break;
        case INVITED: {
            return {
                ...state
            }
        }
        break;
        case SET_COLOR: {
            return {
                ...state, color: (payload?. color), bfv:(payload?. bfv)
            }
        }
        break;
        case SET_DID_REDIRECT: {
            return {
                ...state, didRedirect: (payload?.didRedirect)
            }
        }
        break;
        default: {
            return state;
        }
    }
    // return {
    //     LOGIN: ({
    //         ...state,
    //     }),
    //     LOGOUT: ({
    //         ...initialState,
    //     }),
    //     DEFAULT: state
    // }[type || "DEFAULT"];
}
