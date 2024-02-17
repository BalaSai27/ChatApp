import MessageBox from "./MessageBox";
import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";


const Conversations = ({conversation, username, selectedFriend, addMessage}) => {
    
    const scrollRef = useRef();
    useEffect(()=> {
        scrollRef.current?.scrollIntoView({behavior: "smooth"});
    }, [conversation]);
    if(selectedFriend==='') 
    return (
        <div className="conversation-container">
            <div className="no-conversation-selected">
                Choose a Friend to start Conversation!
            </div>
        </div>
    )
    else
    return (
        <div className="conversation-container">
            <div className="friend-name">
                <Link to={`/user-details/${selectedFriend}`} className="friend-name-title">{selectedFriend}</Link>
                </div>
            <hr />
            <div className="Conversations">
                {conversation.map((message, i) => {
                    return(
                    <div ref={scrollRef} className={message.from===username?"messageByUser":"messageByFriend"}>
                        <p className="message">{message.message}</p>
                    </div>
                    );
                })}
            </div>
            <MessageBox addMessage={addMessage}/>
         </div>
    );
}
 
export default Conversations;