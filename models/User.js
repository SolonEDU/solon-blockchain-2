const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    osis: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    publicaddress: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;