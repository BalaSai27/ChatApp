import { useState } from "react";
const MessageBox = ({ addMessage }) => {
    const [message, setMessage] = useState("");

    const sendMessage = (e) => {
        e.preventDefault();
        const currentMessage = message;
        if(currentMessage.trim().length===0) return;
        setMessage('');
        addMessage(currentMessage.trim());
    }

    return (
        <div className="Message-Box">
            <form>
                <span>
                    <input 
                    type="text" 
                    placeholder="type a message" 
                    className="typing-box" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)}
                    />
                    <button className="send-button" onClick={(e) => sendMessage(e)}>Send</button>
                </span>
            </form>
        </div>
    );
}
 
export default MessageBox;