const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    name: { type: String, required: true },
    oURL: { type: String, required: true },
    sURL: { type: String, required: true, unique: true },
    clicks: { type: Number, required: true, default: 0 },
    userID: { type: String, required: true },
    date: { type: String, default: Date.now }
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    date: { type: String, default: Date.now }
});

const urlModel = mongoose.model("url", urlSchema);
const UserModel = mongoose.model("user", userSchema);

module.exports = { urlModel, UserModel };
