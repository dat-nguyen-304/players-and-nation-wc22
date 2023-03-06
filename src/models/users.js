const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, require: true },
    password: { type: String, require: true },
    name: { type: String, require: true },
    image: { type: String, require: true },
    YOB: { type: Number, require: true },
    isAdmin: { type: Boolean, default: false }
}, { timestamps: true, }
);
var Users = mongoose.model("users", userSchema);

module.exports = Users;