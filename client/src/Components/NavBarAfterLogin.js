import { AiOutlineMessage } from 'react-icons/ai';
import { Link } from 'react-router-dom';
const NavBarAfterLogin = () => {
    return (
        <div className="NavBarBeforeLogin">
             <Link to="/home" style={{textDecoration: "none", alignContent: "center"}}> 
                <div className="title">
                    <AiOutlineMessage className="messaging-icon" style={{color: "#C7B8A0", fontSize: "1.8em"}}/>
                    <h2>Chat App</h2>
                </div>
            </Link>
           
            <div className="buttons-container">
                <Link to="/home" style={{textDecoration: "none"}}>
                    <p className="login" size="sm">Messages</p>
                </Link>
                <Link to="/Connect" style={{textDecoration: "none"}}>
                    <p className="signup" size="sm">Connect</p>
                </Link>
            </div>
        </div>
    );
}
 
export default NavBarAfterLogin;