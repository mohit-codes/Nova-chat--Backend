const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: "username is required to add user",
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    chats: [{ type: mongoose.Schema.Types.ObjectId }],
    groups: [{ type: mongoose.Schema.Types.ObjectId }],
    savedMessages: [{ type: String }],
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);

module.exports = User;
