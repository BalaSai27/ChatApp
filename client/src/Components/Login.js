import { useState, useEffect } from 'react';
import { Redirect } from 'react-router';

const Login = ({ updateUsername }) => {
    const [user, setUser] = useState({username: "", password: ""});
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const inputStyles = { margin: "10px 20px"};

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("user:" + user.username + user.password);
        fetch('/api/login', {
            method: "POST", 
            body: JSON.stringify({
                username: user.username,
                password: user.password
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
            if(res.ok) return res.json();
        }).then((data) => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', user.username);
            console.log("successfully logged in!");
            console.log(data);
            setIsLoggedIn(true);
            updateUsername(user.username);
            console.log("In the login component before the update method");
        }).catch((err) => {
            console.log(err);
        })
    }

    useEffect(() => {
        fetch('/api/')
        .then((res) => {
            if(res.ok) return res.json();
        })
        .then(jsonresponse => console.log(jsonresponse))
        .catch((err) => console.log(err));
    }, []);

    if(isLoggedIn) return <Redirect to="/home"/>
    else
    return (
        <div className="login-container">
            <h2>Login</h2>
            <hr />
            <form className="login-form">
                <label>
                    username:
                    <input 
                    type="text" 
                    style={inputStyles} 
                    onChange={(e)=>setUser({...user, username:e.target.value})}
                    value={setUser.user}/>
                </label>
                <br />
                <label>
                    password:
                    <input 
                    type="password" 
                    style={inputStyles} 
                    onChange={(e)=>setUser({...user, password:e.target.value})}
                    value={setUser.password}/>
                </label>
                <br />
                <input type="submit" 
                className="submit" 
                value="Login" 
                onClick={(e) => {
                    handleSubmit(e);
                    }}/>
            </form>
        </div>
    );
}
 
export default Login;