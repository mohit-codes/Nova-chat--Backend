const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: mongoose.Schema.Types.String,
    isPublic: mongoose.Schema.Types.Boolean,
    groupCode: {
      type: Number,
      required: true,
      unique: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Group = mongoose.model("groups", groupSchema);

module.exports = Group;
