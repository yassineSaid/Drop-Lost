const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const descriptorSchema = new Schema({
    annonce: {
        type: Schema.Types.ObjectId,
        ref: 'annonce',
        required: true
    },
    descriptor: {
        type: Schema.Types.Mixed,
        required: true
    }
})
module.exports = LabelledFaceDescriptor = mongoose.model(
    'labelledFaceDescriptor',
    descriptorSchema
)