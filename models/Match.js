const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MatchSchema = new Schema({
    trouve: {
        type: Schema.Types.ObjectId,
        ref: 'annonce',
    },
    perdu: {
        type: Schema.Types.ObjectId,
        ref: 'annonce',
    },
    methode: {
        type: String,
        required: true,
    },
    code : {
        type : String
    },
    boutique : {
        type: Schema.Types.ObjectId,
        ref: 'stores',
    },
    etat : {
        type : String
    }
});

module.exports = Match = mongoose.model('matchs', MatchSchema);