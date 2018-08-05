const mongoose = require('mongoose');

module.exports = mongoose.model('User',new mongoose.Schema({
    id: String,
    user: String,
    password: String,
    isAdmin: Boolean
}));