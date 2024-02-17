import Friend from "./Friend";

const Friends = ({friends, onFriendClicked}) => {
    return(
        <div>
            {friends.map((friend, i) => {
                return(
                    <div>
                        <Friend friend={friend} index={i} onFriendClicked={onFriendClicked}/>
                    </div>
                );
            })}
        </div>
    );
}
 
export default Friends;