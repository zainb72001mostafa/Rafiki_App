const mongoose =require('mongoose');
const Schema =mongoose.Schema;

const cardSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
},{timestamps: true});

module.exports = mongoose.model('Card', cardSchema);