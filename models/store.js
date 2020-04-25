const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const storeSchema = new Schema({

    agent : {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    store: {
        code: {
            type: String
        },
        name: {
            type: String
        },
        location: {
            type: {
                type: String, 
                enum: ['Point']
            },
            coordinates: {
                type: [Number]
            }
        }
    }
});

const Store = mongoose.model('store', storeSchema);

module.exports = Store;