import ConnectionView from './ConnectionView';
import { useState, useEffect } from 'react';
const ShowConnections = ({connections, username, changeFriendStatus}) => {
    // console.log("in show connections");
    // console.log(connections);    
    const [userFriends, setUserFriends] = useState([]);
    useEffect(() => {
        fetch('/api/user-details', {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            }
        }).then(res => {
            if(res.ok) return res.json();
        }).then(data => {
            const connections=data.connections;
            const friends=connections.filter(connection => connection.type===1);
            setUserFriends(friends); 
        });
        
    }, []);
    if(connections.length===0) 
    return <div className="no-users-found">No Users Found!</div>
    return (
        <div className="show-connections">
            {console.log("In ShowConnections!")}
            {
                connections.map((connection, key) => {
                    return(
                        <ConnectionView connection={connection} userFriends={userFriends} changeFriendStatus={changeFriendStatus}
                        username={username}/>
                    );
                })
            }
        </div>
    );
}
 
export default ShowConnections;