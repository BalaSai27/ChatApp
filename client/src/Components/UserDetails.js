import { useParams } from "react-router";
import { useState, useEffect } from "react";
import ShowConnections from "./ShowConnections";

const UserDetails = ({name}) => {
    const { id } = useParams();
    const [ownerConnections, setOwnerConnections] = useState([]);
    const [joinedAt, setJoinedAt] = useState('');
    const [ownername, setOwnername] = useState('');
    const [allConnectionsToShow, setAllConnectionsToShow] = useState([]);
    const [connectionsToShow, setConnectionsToShow] = useState([]);
    const [mutualConnectionsToShow, setMutualConnectionsToShow] = useState([]);
    const [userFriends, setUserFriends] = useState([]);
    const [friendsType, setFriendsType] = useState(0);
    // fetching the connections of the account holder(Owner)
    useEffect(() => {
        fetch('/api/user-details', {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            }
        }).then(res => {
            if(res.ok) return res.json();
        }).then(data => {
            setOwnername(data.username);
            setOwnerConnections(data.connections); 
        });
    }, [id]);
    //fetching the friends of the user whose details are to be seen
    useEffect(() => {
        if(ownerConnections.length===0) return;
        fetch('/api/user-details/' + id, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            }
        }).then(res => {
            if(res.ok) return res.json();
        }).then(data => {
            const connections=data.connections;
            setJoinedAt(data.joinedAt);
            const friends=[];
            connections.map((connection, key) => {
                if(connection.type===1) friends.push(connection.name);
            })
            setUserFriends(friends);
            let finalConnections=[];
            for(let i=0;i<friends.length;i++) {
                const found=ownerConnections.some(connection => connection.name===friends[i]);
                if(!found) {
                    finalConnections.push({name: friends[i], type: 0});
                    continue;
                }
                const connection = ownerConnections.find(connection => connection.name===friends[i]);
                console.log("connection");
                console.log(connection);
                finalConnections.push(connection);
            }
            const mutualConnections=finalConnections.filter(connection => connection.type===1);
            setMutualConnectionsToShow(mutualConnections);
            setAllConnectionsToShow(finalConnections);
            setConnectionsToShow(finalConnections);
        });
    }, [ownerConnections]);
    const clickedOnAllFriends = () => {
        setFriendsType(0);
        setConnectionsToShow(allConnectionsToShow);
    }
    const clickedOnMutualFriends = () => {
        setFriendsType(1);
        setConnectionsToShow(mutualConnectionsToShow);
    }
    const changeFriendStatus = (connection) => {
        if(connection.type===2 || connection.name===ownername) return;
        let updateToType=1;
        if(connection.type===3) updateToType=1;
        else if(connection.type===1) updateToType=0;
        else if(connection.type===0) updateToType=2;

        fetch(`/api/changeConnectionStatus/${connection.name}/${updateToType}`, {
            method: "PUT", 
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            }
        }).then(res => {
            if(res.ok) return res.json();
        }).then(data => {
            if(updateToType===0) {
                let finalConnections=allConnectionsToShow;
                const index=finalConnections.findIndex(user => user.name===connection.name);
                finalConnections[index].type=0;
                setAllConnectionsToShow(finalConnections);
                finalConnections=mutualConnectionsToShow;
                finalConnections=finalConnections.filter(user => user.name!==connection.name);
                setMutualConnectionsToShow(finalConnections);
            }
            else if(updateToType===2) {
                let finalConnections=allConnectionsToShow;
                const index=finalConnections.findIndex(user => user.name===connection.name);
                finalConnections[index].type=2;
                setAllConnectionsToShow(finalConnections);
            }
            else if(updateToType===1) {
                let finalConnections=allConnectionsToShow;
                const index=finalConnections.findIndex(user => user.name===connection.name);
                finalConnections[index].type=1;
                const reqConnection=finalConnections[index];
                setAllConnectionsToShow(finalConnections);
                setMutualConnectionsToShow([...mutualConnectionsToShow, reqConnection]);
            }
            if(friendsType===0) {
                let connections=allConnectionsToShow(connection => connection!==null);
                setConnectionsToShow(connections);
            }
            else setConnectionsToShow(mutualConnectionsToShow);
        })
    }
    return ( 
    <div className="connect-body">
        <div className="connect-container">
            <h1 className="user-details-username">{id}</h1>
            <div className="user-details-small-container">
                <p className="user-details-name">Name: BalaSai</p>
                <p>joined on: Aug 2001</p>
                <p className="user-details-mutual-friends">Mutual Connections: {mutualConnectionsToShow.length}</p>
            </div>
            <div className="user-details-friends-types">
                <button className={friendsType===0?"user-details-friend-button user-details-button-on":"user-details-friend-button user-details-button-off"} 
                onClick={() => clickedOnAllFriends()}>
                    All Friends
                </button>
                <button className={friendsType===1?"user-details-friend-button user-details-button-on":"user-details-friend-button user-details-button-off"} 
                onClick={() => clickedOnMutualFriends()}>
                    Mutual Friends
                </button>
            </div>
            <ShowConnections connections={connectionsToShow} username={ownername} changeFriendStatus={changeFriendStatus}/>
         </div>
    </div>
    );
}
 
export default UserDetails;