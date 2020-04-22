const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const storeSchema = new Schema({

    nom: {
        type: String,
    },

    ville: {
        type: String,
    },
    adresse: {
        type: String,
    },
    numero: {
        type: Number,
    },
    ObjectsInStore: [{
        type: Schema.Types.ObjectId,
        ref: 'annonce'
    }]
});

const Store = mongoose.model('store', storeSchema);

module.exports = Store;