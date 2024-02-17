import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import NavBarBeforeLogin from './Components/NavBarBeforeLogin';
import NavBarAfterLogin from './Components/NavBarAfterLogin';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Home from './Components/Home';
import Connect from './Components/Connect';
import UserDetails from './Components/UserDetails';

let user='';
function App() {
  const updateUsername = (username) => {
    user=username;
    console.log("printing the Username in the App.js" + user);
  }
  return (
    <Router>
      <div className="App">
        <Route exact path="/">
          <NavBarBeforeLogin />
          <Login updateUsername={updateUsername}/>
        </Route>
        <Route exact path="/login">
          <NavBarBeforeLogin />
          <Login updateUsername={updateUsername}/>
        </Route> 
        <Route path="/signup">
          <NavBarBeforeLogin />
          <Signup />
        </Route>
        <Route path="/home">
          <div className="test">
          <NavBarAfterLogin />
          <Home user={user}/>
          </div>
        </Route>
        <Route path="/Connect">
          <div className="test">
          <NavBarAfterLogin />
          <Connect />
          </div>
        </Route>
        <Route path="/user-details/:id">
            <NavBarAfterLogin />
            <UserDetails />
        </Route>
      </div>
    </Router>
  );
}

export default App;
