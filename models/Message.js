const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    conversation: {
        type: Schema.Types.ObjectId,
        ref: 'conversations',
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    body: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        default: Date.now,
    },
    message: {
        type:String,
        enum: ["texte", "image"],
        default : "texte"
    }
});

module.exports = Message = mongoose.model('messages', MessageSchema);
