import React, {useState} from "react";
import {useDispatch} from "react-redux";
import axios from "../connection/axios";
import {Link, Redirect, useHistory} from "react-router-dom";
import RoutesList from "../RoutesList";

export default function SignUp() {
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();

    async function onSignUp(e) {
        e.preventDefault();
        setLoading(true);
        if (username && email && password && email?.toString().trim() && password?.toString().trim() && username?.toString().trim()) {
            await axios.post('/user/signup', {
                email, password, username, name: username
            }).then(r => r.data)
                .then(r => {
                    if(r.userId){
                        setUsername(null);
                        setEmail(null);
                        setPassword(null);

                        alert("User successfully registered");
                        history.push(RoutesList.login)
                        return <Redirect to={RoutesList.login} />
                    }
                })
                .catch(e => {
                    if (e.response.status === 409) {
                        alert("Account already exists");
                    } else {
                        alert("Something went wrong!");
                    }
                    // console.log(e.response.status);
                    // console.log(e.message)
                })
                .finally(() => setLoading(false))
        }
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form>
                    <h3>Sign Up</h3>
                    <div className="form-group">
                        <label>Username</label>
                        <input value={username} type="text" className="form-control" placeholder="User name"
                               onChange={e => setUsername(e.currentTarget.value)}/>
                    </div>
                    <div className="form-group">
                        <label>Email address</label>
                        <input value={email} type="email" className="form-control" placeholder="Enter email"
                               onChange={e => setEmail(e.currentTarget.value)}/>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input value={password} type="password" className="form-control" placeholder="Enter password"
                               onChange={e => setPassword(e.currentTarget.value)}/>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block" onClick={onSignUp}>Sign Up</button>
                    <p className="forgot-password text-right">
                        Already registered <Link to={RoutesList.login}>sign in?</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
