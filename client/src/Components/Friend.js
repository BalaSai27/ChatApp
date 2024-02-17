const Friend = ({friend, index, onFriendClicked}) => {
    return (
        <div className="friend" onClick={() => onFriendClicked(index)}>
            {friend}
        </div>
    );
}
 
export default Friend;