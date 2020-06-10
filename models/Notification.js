const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Notification = new Schema({
    recipients: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    content: { type: String, required: true, trim: true },
        
},{
    timestamps : true,
});

module.exports = mongoose.model('notification', Notification);