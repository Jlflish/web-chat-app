const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // 好友列表
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // 好友请求
});

module.exports = mongoose.model("User", UserSchema);
