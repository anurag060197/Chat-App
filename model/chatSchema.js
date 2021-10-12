const mongoose = require('mongoose');

const msgSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Chats', msgSchema);