const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportJWT = require('passport-jwt');
const path = require('path');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/user');
const Conversation = require('./models/conversation');
const cors = require('cors');
const { join } = require('path');
const { RSA_NO_PADDING } = require('constants');

JWTStrategy = passportJWT.Strategy;
const app = express();

// MongoDB credentials
const MONGODB_URL = 'mongodb+srv://BalaSai:BalaSaipassword@testcluster.ryjkd.mongodb.net/chat_app_database?retryWrites=true&w=majority';
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useunifiedTopology: true })
    .then((result) => {
        app.listen(8800)
        console.log("connected to mongodb!")
    })
    .catch(err => console.log(err));


const users=["Bala", "BalaSai", "BalaSaiSrinivas", "Bihar", "SaiSrinivas", "Srinivas", "Baa", "Baaa", "Balaaa", "Balaaaa", "Baalaa"];
const user = {
    id:"1",
    username:"BalaSai", 
    password: "password",
    // friends: ["Bala", "sai", "srinivas","thungala"], 
    connections: [
        {name:"Bala", type:1}, 
        {name: "sai", type: 1},
        {name: "srinivas", type: 1},
        {name: "thungala", type: 1},
        {name: "BalaSai", type: 2},
        {name: "BalaSaiSrinivas", type: 2},
        {name: "Thungala", type: 3},
        {name: "saiSrinivas", type: 3},
    ],
    // sentPendingRequests: ["Bala", "sai"],
    // receivedPendingRequests: ["srinivas", "thungala"],
    // pendingRequests: [ 
    //     {name: "Bala", type: 0},
    //     {name: "sai", type: 0},
    //     {name: "srinivas", type: 1},
    //     {name: "thungala", type: 1},
    // ]
};
const dupUser = {
    id:"2", 
    username: "srinivas",
    password: "password",
    // friends: ["Bala", "sai", "srinivas","BalaSai"],
    // pendingRequests: [ 
    //     {name: "Bala", type: 0},
    //     {name: "sai", type: 0},
    //     {name: "srinivas", type: 1},
    //     {name: "BalaSai", type: 1},
    // ],
    connections: [
        {name:"Bala", type:1}, 
        {name: "sai", type: 1},
        {name: "srinivas", type: 1},
        {name: "thungala", type: 1},
        {name: "BalaSai", type: 2},
        {name: "BalaSaiSrinivas", type: 2},
        {name: "Thungala", type: 3},
        {name: "saiSrinivas", type: 3},
    ],

}

const conversations = [{
    from: "BalaSai",
    to: "sai",
    message: "I am good!"
},{
    from: "BalaSai",
    to: "sai",
    message: "I am good!"
},{
    from: "sai",
    to: "BalaSai",
    message: "how aren't you!"
},{
    from: "BalaSai",
    to: "sai",
    message: "I am good!"
},{
    from: "sai",
    to: "BalaSai",
    message: "how aren't you!"
},{
    from: "BalaSai",
    to: "sai",
    message: "I am good!"
},{
    from: "sai",
    to: "BalaSai",
    message: "how aren't you!"
}]
app.use(express.json());
app.use(express.static('../client/build'));
app.use(passport.initialize());
app.use(
    cors({
        origin: "http://localhost:3000"
    })
);
passport.use(new LocalStrategy({
    usernameField: "username"
}, async (username , password, done) => {
    return User.find({username: username})
    .then(result => {
        if(result.length===0) {
            return done(null, false, {
                message: "username or password is incorrect!"
            })
        } 
        if(username===result[0].username && password===result[0].password) 
        return done(null, result[0]);
        else return done(null, false, {
        message: "username or password is incorrect!"
        })
    })
    .catch((err) => {
        return done(null, false, {
            message: "something went wrong! please try again!"
        })
    });
    
}));
passport.use(new JWTStrategy({
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "jwt_secret"
}, async (jwt_payload, done) => {
    return User.find({username: jwt_payload.user.username})
        .then((result) => {
            if(result.length===0) {
                return done(null, false, {
                    message: "token not matched"
                });
            }
            if(result[0]._id==jwt_payload.user._id) 
            return done(null, result[0]);
            else 
            return done(null, false, {
                message: "token not matched"
            })
        })
}));

const jsonresponse = JSON.stringify({
    names: "Bala"
});
// *****test Routes********

app.get('/api/add-user', (req, res) => {
    const user = new User({
        username: "srinivas", 
        password: "password",
        firstName: "BalaSaiSrinivas",
        lastName: "thungala",
        connections: [
            {name: "BalaSai", type: 1},
            {name: "BalaSaiSrinivas", type: 1},
        ]
    })
    user.save()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        })
});
app.get('/api/get-users', (req, res) => {
    User.find()
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
        })
});

app.get('/api/add-conversation', (req, res) => {
    const conversation = new Conversation({
        from: "Bala", 
        to:"Sai",
        message: "I am good!"
    });
    conversation.save()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        })
});
app.get('/api/all-conversations', (req, res) => {
    Conversation.find()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        })
});
app.get('/api/update-user', (req, res) => {
    // {$and: [{username: "BalaSai"}, {'connections.name': "Bala"}]}, {$set: {'connections.$.type': 1}}
    User.updateOne({username: "Bala"}, {$pull : {"connections": {name: "BalaSai", type: 3}}})
        .then((result) => {
            res.json(result)
        })
        .catch((err) => {
            console.log(err)
        })
})
// **********routes*************
app.get('/', (req, res) => {
    res.sendFile(path.resolve('../client/public/index.html'));
})
app.get('/api/', (req, res) => {
    console.log("request made!");
    res.setHeader('Content-Type', 'application/json');
    res.json(jsonresponse);
});
// end point for logging In, verifies the user and sends the jwt token
app.post('/api/login', (req, res, next) => {
    passport.authenticate("local", (err, user) => {
        // Have a look
        if(err) {
            return next(err)
        }
        if(!user) {
            return res.send("username or password is incorrect!");
        }
        req.login(user, () => {
            const body={_id: user._id, username: user.username}

            const token = jwt.sign({user: body}, "jwt_secret")
            return res.json({token})
        })
    })(req, res, next)
});
//get both friends and conversations of logged In user
app.get('/api/friendsAndConversations', passport.authenticate("jwt", { session: false }), (req, res) => {
    if(!req.user) {
        res.sendStatus(404).send("Invalid token!");
    }
    else {
        const username=req.user.username;
        let userConversations = [];
        Conversation.find({$or: [{from: username}, {to: username}]})
            .then((result) => {
                result.map((conversation, key) => {
                    userConversations.push({from: conversation.from, to: conversation.to, message: conversation.message, createdAt: conversation.createdAt});
                });
                let connections=req.user.connections;
                let friends = [];
                connections.map((connection, key) => {
                    if(connection.type===1) friends.push(connection.name);
                })
                res.json({
                    username: req.user.username,
                    friends: friends,
                    conversations: userConversations
                });
            })
            .catch((err) => {
                console.log(err);
            })
            
    }
});
//get the conversations of the logged in User
app.get('/api/conversations', passport.authenticate("jwt", { session: false }), (req, res) => {
    if(!req.user) res.sendStatus(404).send('Invalid token!');
    const username = req.user.username;
    let userConversations = [];
    Conversation.find({$or: [{from: username}, {to: username}]})
        .then((result) => {
            result.map((conversation, key) => {
                userConversations.push({from: conversation.from, to: conversation.to, message: conversation.message, createdAt: conversation.createdAt});
            })
            res.json(userConversations);
        })
        .catch((err) => {
            console.log(err);
        })
});
//get the pendingRequest for the logged in User
app.get('/api/pendingRequests', passport.authenticate("jwt", { session: false }), (req, res) => {
    if(!req.user) res.sendStatus(404).send("Invalid token!");
    const connections=req.user.connections;
    const pendingRequests=connections.filter(connection => connection.type!=1);
    res.json({
        pendingRequests: pendingRequests
    });
});
//get the user-details for a given username
app.get('/api/user-details/:username', passport.authenticate("jwt", { session: false }), (req, res) => {
    if(!req.user) res.sendStatus(404).send("Invalid token!");
    const username = req.params.username;
    // console.log(username);
    let connections=[];
    let joinedAt='';
    User.find({username: username})
        .then((result) => {
            if(result.length===0) {
                //Have a look
                res.json({
                    username: username,
                    connections: [],
                    joinedAt: ''
                })
            };
            connections=result[0].connections;
            // console.log(connections);
            joinedAt=result[0].createdAt;
            res.json({
                username: username,
                connections: connections,
                joinedAt: joinedAt
             });
        })
        .catch((err) => {
            console.log(err);
        })
});
//get the Logged In user details 
app.get('/api/user-details', passport.authenticate("jwt", { session: false }), (req, res) => {
    if(!req.user) res.sendStatus(404).send("Invalid token!");
    res.json({
        username: req.user.username,
        connections: req.user.connections
    })
})
// get the search results for a given username
app.get('/api/search/:searchword', passport.authenticate("jwt", { session: false }), (req, res) => {
    if(!req.user) res.sendStatus(404).send("Invalid token!");
    const users=[];
    User.find()
        .then((result) => {
            result.map((user, key) => {
                users.push(user.username);
            })
            const searchword=req.params.searchword;
            const searchResults = users.filter(user => user.includes(searchword));
            res.json({
                searchResults
            });
        })
        .catch((err) => {
            console.log(err);
        })
});

// POST ROUTES
app.post('/api/sendMessage/:toUser', passport.authenticate("jwt", { session: false }), (req, res) => {
    const conversation = new Conversation({
        from: req.user.username,
        to: req.params.toUser,
        message: req.body.message
    });
    conversation.save()
        .then((result) => {
            res.json({
                from: result.from,
                to: result.to,
                message: result.message,
                createdAt: result.createdAt
            });
        })
        .catch(err => {
            console.log(err);
        })
});

// PUT ROUTES
app.put('/api/changeConnectionStatus/:connectionName/:updateToType', passport.authenticate("jwt", { session: false }), (req, res) => {
    if(!req.user) res.sendStatus(404).send("Invalid token!");
    const updateToType=parseInt(req.params.updateToType);
    const username=req.user.username;
    const connectionName = req.params.connectionName;
    if(updateToType===0) {
        User.updateOne({username: username}, {$pull : {"connections": {name: connectionName, type: 1}}})
            .then(() => {
                User.updateOne({username: connectionName}, {$pull: {"connections": {name: username, type: 1}}})
                    .then(() => {
                        res.json({});
                    })
                    .catch((err) => {
                        console.log(err);
                        res.json({});
                    });
            })
            .catch(err => {
                console.log(err);
                res.json({});
            });
    }
    else if(updateToType===1)
    {
        User.updateOne({$and: [{username: username}, {'connections.name': connectionName}]}, {$set: {'connections.$.type': updateToType}})
            .then(() => {
                User.updateOne({ $and: [{username: connectionName}, {'connections.name': username}]}, { $set: {'connections.$.type': updateToType}})
                    .then(() => {
                        res.json({});
                    })
                    .catch((err) => {
                        console.log(err);
                        res.sendStatus(500).json({message: "something went wrong! please try again!"});
                    })
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(500).json({message: "something went wrong! please try again!"});
            })
    }
    else if(updateToType===2) {
        User.updateOne({username: username}, {$push : {"connections": {name: connectionName, type: 2}}})
            .then(() => {
                User.updateOne({username: connectionName}, {$push : {"connections": {name: username, type: 3}}})
                    .then(() => {
                        res.json({});
                    })
                    .catch((err) => {
                        console.log(err);
                        res.sendStatus(500).json({message: "something went wrong! please try again!"});
                    })
            })
            .catch((err) => {
                console.log(err);
                res.sendStatus(500).json({message: "something went wrong! please try again!"});
            })
    }
        
})