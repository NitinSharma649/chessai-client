import React, {useState} from "react";
import axios from "../connection/axios";
import {useDispatch} from "react-redux";
import {LOGIN} from "../redux/action_types/action_types";
import {ColorContext} from "../context/colorcontext";

export default function Login() {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const color = React.useContext(ColorContext)

    async function onLogin(e) {
        e.preventDefault();
        setLoading(true)
        if(email && password && email?.toString().trim() && password?.toString().trim()){
            await axios.post('/user/login', {
                email, password
            }).then(r=>r.data)
                .then(r=>{
                    if(r.token && r.userId && r.username){
                        console.log(r)
                        dispatch({
                            type: LOGIN,
                            payload: r
                        });
                    }
                })
                .catch(e=>{
                    if(e.response.status === 401){
                        alert("Please provide correct email and password");
                    } else {
                        alert("Something went wrong!");
                    }
                    // console.log(e.response.status);
                    // console.log(e.message)
                })
                .finally(()=>setLoading(false))
        }
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form>
                    <h3>Sign In</h3>

                    <div className="form-group">
                        <label>Email address</label>
                        <input value={email} type="email" className="form-control" placeholder="Enter email" onChange={(e)=>setEmail(e.currentTarget.value)}/>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input value={password} type="password" className="form-control" placeholder="Enter password" onChange={(e)=>setPassword(e.currentTarget.value)}/>
                    </div>

                    {/*<div className="form-group">*/}
                    {/*    <div className="custom-control custom-checkbox">*/}
                    {/*        <input type="checkbox" className="custom-control-input" id="customCheck1"/>*/}
                    {/*        <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    <button type="submit" className="btn btn-primary btn-block" onClick={onLogin}>Submit</button>
                    {/*<p className="forgot-password text-right">*/}
                    {/*    Forgot <a href="#">password?</a>*/}
                    {/*</p>*/}
                </form>
            </div>
        </div>
    );
}
