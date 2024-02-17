import { useState } from 'react';
import { Redirect, useHistory } from 'react-router';
const inputStyles = { margin: "10px 20px"};
const Signup = () => {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        password: ""
    });
    const [signedUp, setSignedUp] = useState(false);
    let history=useHistory();
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("new user" + user.firstName, user.lastName, user.userName, user.password);
        setSignedUp(true);
        setTimeout(() => {
            history.push('/');
        }, 1000);
    }

    return (
        <div>
            <div className="signup-container">
                <h2>Signup</h2>
                <hr />
                <form className="signup-form">
                    <label>
                        First Name:
                        <input 
                        type="text" 
                        style={inputStyles}
                        value={user.firstName}
                        onChange={(e) => setUser({...user, firstName:e.target.value})}
                        />
                    </label>
                    <label>
                        Last Name:
                        <input 
                        type="text" 
                        style={inputStyles}
                        value={user.lastName}
                        onChange={(e) => setUser({...user, lastName:e.target.value})}/>
                    </label>
                    <label>
                        username:
                        <input 
                        type="text" 
                        style={inputStyles}
                        value={user.userName}
                        onChange={(e) => setUser({...user, userName:e.target.value})}/>
                    </label>
                    <br />
                    <label>
                        password:
                        <input 
                        type="password" 
                        style={inputStyles}
                        value={user.password}
                        onChange={(e) => setUser({...user, password:e.target.value})}/>
                    </label>
                    <br />
                    <input 
                    type="submit" 
                    className="submit" 
                    value="Signup"
                    onClick={(e) => handleSubmit(e)}/>
                </form>
            </div>
        {signedUp?<div className="success-status">Signed Up Successfully! Redirecting to Login...</div>: ""}
        </div>
    );
}
 
export default Signup;