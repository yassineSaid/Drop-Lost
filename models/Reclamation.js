
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Reclamation = new Schema({
    address: {
        type: String,
 
    },

    lng: {
        type: String,
 
    },
    lat: {
        type: String,
 
    },
    description: {
        type: String,
 
    },
    photo: {
        type: [String]
    },
    date: {
        type: Date,
 
    },
    user: { type: Schema.Types.ObjectId, ref: 'user' },

});

module.exports = mongoose.model('reclamation', Reclamation);