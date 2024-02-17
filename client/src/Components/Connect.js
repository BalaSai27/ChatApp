import { useEffect, useState } from 'react';
import Select from 'react-select';
import ShowConnections from './ShowConnections';
const Connect = () => {
    const [allPendingRequests, setAllPendingRequests] = useState([]);
    const [connectionsToShow, setConnectionsToShow] = useState([]);
    const [username, setUsername] = useState('');
    const [allUserConnections, setAllUserConnections] = useState([]);
    const [filterOption, setFilterOption] = useState("all");
    const [showPendingRequestText, setShowPendingRequestText] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const showPendingRequestsOptions= [
        {value: "all", label: "All"}, 
        {value: "sent", label: "Sent"},
        {value: "received", label: "Received"},
        {value:"friends", label: "Friends"},
        {value: "notFriends", label: "Not Friends"}
    ];
    useEffect(() => {
        fetch('/api/user-details'  , {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            }
        }).then(res => {
            if(res.ok) return res.json();
        }).then(data => {
            const connections=data.connections;
            const pendingRequests=connections.filter(connection => connection.type!=1);
            setUsername(data.username);
            setAllUserConnections(connections);
            setAllPendingRequests(pendingRequests);
            setConnectionsToShow(pendingRequests);
        });
    }, []);
    const handleOptionChange = (e) => {
        const selectedOption = e.value;
        setFilterOption(selectedOption);
        const connections=(showPendingRequestText?allPendingRequests:searchResults);
        changeConnectionsToShowAccToSelectedOption(connections, selectedOption)
    }
    const changeConnectionsToShowAccToSelectedOption = (connections, selectedOption) => {
        // console.log("In the ChangeConnection.....");
        if(selectedOption==='all') {
            const requests=connections.filter(request => request !== null);
            console.log("setting connectionsToShow as req Value!");
            setConnectionsToShow(requests);
        }
        else if(selectedOption==='sent') {
            const requests=connections.filter(request => request.type===2);
            setConnectionsToShow(requests);
        }
        else if(selectedOption==='friends') {
            const requests=connections.filter(request => request.type===1);
            setConnectionsToShow(requests);
        }
        else if(selectedOption==='notFriends') {
            const requests=connections.filter(request => request.type===0);
            setConnectionsToShow(requests);
        }
        else {
            const requests=connections.filter(request => request.type===3);
            setConnectionsToShow(requests);
        }
    }
    const changeFriendStatus = (connection) => {
        if(connection.type===2) return;
        let updateToType=1;
        if(connection.type===3) updateToType=1;
        else if(connection.type===1) updateToType=0;
        else if(connection.type===0) updateToType=2;

        fetch(`/api/changeConnectionStatus/${connection.name}/${updateToType}`, {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            }
        }).then((res) => {
            if(res.ok) return res.json();
        }).then((data) => {
            let connections=(showPendingRequestText?allPendingRequests:searchResults);
            if(updateToType===0) {
                connections=connections.filter(user => user.name!==connection.name);
                const finalAllUserConnections = allUserConnections.filter(user => user.name!==connection.name);
                setSearchResults(connections);
                setAllUserConnections(finalAllUserConnections);
            }
            else if(updateToType===1) {
                const index=connections.findIndex(user => user.name===connection.name);
                connections[index].type=1;
                let finalAllUserConnections=allUserConnections;
                const index1=finalAllUserConnections.findIndex(user => user.name===connection.name);
                finalAllUserConnections[index1].type=1;
                setAllUserConnections(finalAllUserConnections);
                const pendingRequests = allPendingRequests.filter(request => request.name!==connection.name);
                setAllPendingRequests(pendingRequests);
                if(!showPendingRequestText) setSearchResults(connections);
            }
            else if(updateToType===2) {
                setAllPendingRequests([...allPendingRequests, {name: connection.name, type: 2}]);
                setAllUserConnections([...allUserConnections, {name: connection.name, type: 2}]);
                const index=connections.findIndex(user => user.name === connection.name);
                connections[index].type=2;
                setSearchResults(connections);
            }
            changeConnectionsToShowAccToSelectedOption(connections, filterOption);
        })

    }
    let fetching = false;
    let controller = new AbortController();
    const handleSearch = (searchword) => {
        if(fetching) {
            controller.abort();
            controller=new AbortController();
            console.log("cancelling the request!");
        }
        if(searchword.length===0) {
            let finalConnections=allPendingRequests;
            changeConnectionsToShowAccToSelectedOption(finalConnections, filterOption);
            setShowPendingRequestText(true);
            return;
        }
        fetching=true;
        const signal = controller.signal;
        setShowPendingRequestText(false);
        fetch('/api/search/' + searchword, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            },
            signal: signal
        }).then(res => {
            if(res.ok) return res.json();
        }).then(data => {
            fetching=false;
            const searchResults=data.searchResults; 
            let finalConnections=[];
            searchResults.map((result, key) => {
                const found = allUserConnections.some(connection => connection.name===result);
                if(!found) {
                    finalConnections.push({name: result, type: 0});
                }
                else {
                    const connection = allUserConnections.find(connection => connection.name===result);
                    finalConnections.push(connection);
                }
            });
            setSearchResults(finalConnections);
            changeConnectionsToShowAccToSelectedOption(finalConnections, filterOption);
        })
    }
    return (
        <div className="connect-body">
            <div className="connect-container">
                <div className="search-box-container">
                    <input 
                    type="text"
                    className="search-friends"
                    placeholder="Search for people..."
                    onChange={(e)=> handleSearch(e.target.value)}
                    />
                </div>
                <div className="filter-options-dropdown">
                    <div className="pending-requests-text">{showPendingRequestText?"Pending Requests":"Search Results"}</div>
                    <Select 
                    options={showPendingRequestsOptions}
                    defaultValue={{label: 'All', value: 'all'}}
                    onChange={(e) => handleOptionChange(e)}/>
                </div>
                <div className="show-connections-container">
                     <ShowConnections connections={connectionsToShow} username={username} changeFriendStatus={changeFriendStatus}/>
                 </div>
            </div>
        </div>
    );
}
 
export default Connect;