const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String, 
        requried: true
    }, 
    message: {
        type:String,
        required: true
    }
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;