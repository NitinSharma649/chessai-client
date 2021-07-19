import {createContext} from 'react'
import Chess from 'chess.js';

export const ColorContext = createContext({
    didRedirect: false,
    playerDidRedirect: () => {},
    playerDidNotRedirect: () => {},
    game: new Chess(),
    setGame: () => {}
})