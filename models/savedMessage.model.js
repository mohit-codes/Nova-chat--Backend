const mongoose = require("mongoose");

const savedMessageSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    iv: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const SavedMessage = mongoose.model("savedMessages", savedMessageSchema);

module.exports = SavedMessage;
