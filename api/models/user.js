const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    firstName: {
        type: String, 
        requried: true
    }, 
    lastName: {
        type: String, 
        required: true
    },
    password: {
        type: String, 
        required: true
    }, 
    connections: {
        type: Array,
        required: true
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;