import { AiOutlineMessage } from 'react-icons/ai';
import { Link } from 'react-router-dom';
const NavBarBeforeLogin = () => {
    return (
        <div className="NavBarBeforeLogin">
             <Link to="/" style={{textDecoration: "none", alignContent: "center"}}> 
                <div className="title">
                    <AiOutlineMessage className="messaging-icon" style={{color: "#C7B8A0", fontSize: "1.8em"}}/>
                    <h2>Chat App</h2>
                </div>
            </Link>
           
            <div className="buttons-container">
                <Link to="/login" style={{textDecoration: "none"}}>
                <p className="login" size="sm">Login</p>
                </Link>
                <Link to="/signup" style={{textDecoration: "none"}}>
                <p className="signup" size="sm">Signup</p>
                </Link>
            </div>
        </div>
    );
}
 
export default NavBarBeforeLogin;