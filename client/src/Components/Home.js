import { useEffect, useState, useContext } from 'react';
import Conversations from './Conversations';
import Friends from './Friends';
import { io } from 'socket.io-client';

const Home = ({ user }) => {
    const [username, setUserName] = useState("");
    const [selectedFriend, setSelectedFriend] = useState('');
    const [friends, setFriends] = useState(["Bala", "sai", "srinivas"]); 
    const [onlineFriends, setOnlineFriends] = useState(["Bala", "Sai", "Srinivas"]);
    const [allConversations, setAllConversations] = useState([]);


    //default conversations to show 
    const [selectedConversation, setSelectedConversation] = useState([{
        to: "BalaSai",
        from: "sai",
        message: "how are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are you!"
    },{
        from: "BalaSai",
        to: "sai",
        message: "how are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are you!"
    },{
        to: "BalaSai",
        from: "sai",
        message: "how are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are you!"
    },{
        from: "BalaSai",
        to: "sai",
        message: "how are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are you!"
    },{
        to: "BalaSai",
        from: "sai",
        message: "how are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are you!"
    },{
        from: "BalaSai",
        to: "sai",
        message: "how are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are you!"
    },{
        to: "BalaSai",
        from: "sai",
        message: "how are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are you!"
    },{
        from: "BalaSai",
        to: "sai",
        message: "how are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are you!"
    },{
        to: "BalaSai",
        from: "sai",
        message: "how are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are you!"
    },{
        from: "BalaSai",
        to: "sai",
        message: "how are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are you!"
    },{
        to: "BalaSai",
        from: "sai",
        message: "how are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are youhow are you!"
    },]);
    
    
    const [socket, setSocket] = useState(null);

    //fetching friends and conversations of user
    useEffect(() => {
        fetch('/api/friendsAndConversations', {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            }
        }).then(res => {
            if(res.ok) return res.json();
        }).then(data => {
            setUserName(data.username);
            setFriends(data.friends);
            setAllConversations(data.conversations);
            setSocket(io("http://localhost:8080"));
            console.log("All Ok");
        });
    }, []);


    useEffect(() => {
        return () => {
            console.log(socket);
            if(socket!==null) socket.disconnect();
        }
    }, [socket]);


    const [isFirstTime, setIsFirstTime] = useState(true);
    useEffect(() => {
        if(socket===null) return;
        const username=localStorage.getItem('username');
        console.log("socket changed!");
        //socket event handlers
        socket.on('connect', () => {
            console.log(`connected through ${socket.id}`);
            socket.emit('add-user', username, socket.id);
        });
        socket.on('disconnect', () => {
            console.log("disconnected User!");
            socket.emit('disconnectUser', username);
        });
        // socket.on('new-user-connected', (usersConnected) => {
        //     console.log("new-user-connected!");
        //     const onlineUsers=[];
        //     console.log("printing the users of usersConnected: ");
        //     for(let [user, value] of Object.entries(usersConnected)) {
        //         console.log(user);
        //         const isUserAFriend = friends.includes(user);
        //         if(isUserAFriend)
        //         onlineUsers.push(user);
        //     }
        //     setOnlineFriends(onlineUsers);
        // });

        if(isFirstTime) {
            setIsFirstTime(false);
            socket.on('receive-message', (message, fromUser) => {
                console.log("inside receive message!");
                setAllConversations([...allConversations, {from: fromUser, to: username, message: message}]);
                if(selectedFriend===fromUser) {
                    setSelectedConversation([...selectedConversation, {from: fromUser, to: username, message: message}]);
                }
            });
        }
    }, [socket, allConversations, selectedConversation, isFirstTime]);

    useEffect(() => {
        console.log("allConversations Changed!");
    }, [allConversations]);

    useEffect(() => {
        console.log("selectedConversation changed!");
    }, [selectedConversation]);

    //handler functions
    const onFriendClicked = (index) => {
        const selectedFriend=friends[index];
        const conversation = allConversations.filter(conversation => (conversation.from===selectedFriend||conversation.to===selectedFriend));
        setSelectedConversation(conversation);
        setSelectedFriend(selectedFriend);
        console.log("selectedFriend");
        console.log(selectedFriend);
    }

    //adding newMessage to the messages array
    const addMessage = (message) => {
        fetch('/api/sendMessage/'+selectedFriend, {
            method: "POST",
            body: JSON.stringify({
                message: message
            }),
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        }).then(res => {
            if(res.ok) return res.json();
        }).then(data => {
            setAllConversations([...allConversations, {from: data.from, to: data.to, message: data.message, createdAt: data.createdAt}]);
            setSelectedConversation([...selectedConversation, {from: data.from, to: data.to, message: data.message, createdAt: data.createdAt}]);
            console.log(socket!==null?socket.id:"it is null");
            if(socket!==null)
            socket.emit('send-message', message, selectedFriend);
        })
    }
    return (
        <div className="Home">
            <div className="friends">
                <div className="online-friends-title">Friends</div>
                <hr />
                <Friends friends={friends} onFriendClicked={onFriendClicked}/>
            </div>
            <div className="conversation">
                <Conversations conversation={selectedConversation} username={username} selectedFriend={selectedFriend} addMessage={addMessage}/>
            </div>
            <div className="online-friends">
                <div className="online-friends-title">online friends</div>
                <hr/>
                {/* <Friends friends={onlineFriends} onFriendClicked={onFriendClicked}/> */}
            </div>
        </div>
    );
}
 
export default Home;