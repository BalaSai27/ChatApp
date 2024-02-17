import {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
const ConnectionView = ({connection, userFriends, changeFriendStatus, username}) => {
    const [connectionFriends, setConnectionFriends] = useState([]);
    useEffect(() => {
        fetch('/api/user-details/'+ connection.name, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            }
        }).then(res => {
            if(res.ok) return res.json();
        }).then(data => {
            const connections=data.connections;
            const friends=connections.filter(connection => connection.type===1);
            setConnectionFriends(friends);
        })
    }, []);
    const findMututalConnections = () => {
        // let mp={};
        // let mutualFriends=0;
        // for(let i=0;i<userFriends.length;i++) {
        //     mp[userFriends[i]]=1;
        // }
        // for(let i=0;i<connectionFriends.length;i++) {
        //     if(connectionFriends[i] in mp) mutualFriends++;
        //     console.log(connectionFriends[i]);
        //     console.log(connectionFriends[i] in mp);
        // }
        // return mutualFriends;
        let mutualFriends=0;
        connectionFriends.map((connection, key) => {
            const found=userFriends.some(friend => friend.name===connection.name);
            if(found) mutualFriends+=1;
        })
        return mutualFriends;
    }
    const classNameOfFriendStatus = (status) => {
        if(status===0) return "status-button status-button-accept";
        else if(status===1) return "status-button status-button-accept";
        else if(status===2) return "status-button";
        else return "status-button status-button-accept";
    }
    const buttonTextOfFriendStatus = (status) => {
        if(status===0) return "send";
        else if(status===1) return "unfriend";
        else if(status===2) return "pending";
        else return "accept";
    }
    return (
        <div className="connection-view">
            {console.log("In ConnectionView!")}
            <div className="connection-name">
                <Link to={"/user-details/" + connection.name} className="user-details-link">{connection.name}</Link>
            </div>
            <div style={{color: "grey"}}>
                <Link to={"/user-details/" + connection.name} className="user-details-link" style={{color: "grey"}}>
                    {connectionFriends.length===0?0:findMututalConnections()} mutual connections
                </Link>
            </div>
            <button 
            className={classNameOfFriendStatus(connection.type)} 
            disabled={connection.type===2 || connection.name===username}
            onClick={(e) => changeFriendStatus(connection)}
            >
                <div>{connection.name===username?"You":buttonTextOfFriendStatus(connection.type)}</div>
            </button>
        </div>
    );
}
 
export default ConnectionView;