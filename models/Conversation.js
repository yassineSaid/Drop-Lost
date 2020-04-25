const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema for Users
const ConversationSchema = new Schema({
    recipients: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    annonce : { type: Schema.Types.ObjectId, ref: 'annonce' },
    lastMessage: {
        type: String,
    },
    from: {
        type: Schema.Types.ObjectId, 
        ref: 'user'
    },
    date: {
        type: String,
        default: Date.now,
    },
});

module.exports = Conversation = mongoose.model(
    'conversations',
    ConversationSchema
);
