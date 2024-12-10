

const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    username: { type: String, required: true, minlength: 4, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ }, // Basic email validation
    fullName: { type: String, required: true, minlength: 2 },
    createdAt: { type: Date, default: Date.now }, // Timestamp
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;
