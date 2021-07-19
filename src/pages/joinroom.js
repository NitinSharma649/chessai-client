import React from 'react'
import JoinGame from './joingame'
import OneToOneChess from "./OneToOneChess";
import {connect} from "react-redux";

/**
 * Onboard is where we create the game room.
 */

class JoinRoom extends React.Component {
    state = {
        didGetUserName: false,
        inputText: "",
    }

    constructor(props) {
        super(props);
        this.textArea = React.createRef();
    }

    render() {

        console.log(4)

        return (<React.Fragment>
            {
                this.props.didRedirect ?
                    <React.Fragment>
                        <JoinGame userName = {'Open'} isCreator = {false}/>
                        <OneToOneChess userName = {'Open'}/>
                    </React.Fragment>
                    : this.setState({
                        didGetUserName: true
                    })
            }
        </React.Fragment>)
    }
}

const mapStateToProps = state => ({
    username: state.userReducer.username,
    didRedirect: state.userReducer.username
})

export default connect(mapStateToProps, null)(JoinRoom)