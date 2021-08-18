const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    admin: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    members: {
      type: Array,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Group = mongoose.model("groups", groupSchema);

module.exports = Group;
