const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MatchSchema = new Schema({
    annonces: [
        { type: Schema.Types.ObjectId, ref: 'annonces' }
    ],
    methode: {
        type: String,
        required: true,
    },
    code : {
        type : String,
        default : ''
    },
    boutique : {
        type: Schema.Types.ObjectId,
        ref: 'stores',
    },
    date: {
        type: String,
        default: Date.now,
    },
    etat : {
        type : String
    }
});

module.exports = Match = mongoose.model('matchs', MatchSchema);