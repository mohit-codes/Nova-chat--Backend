const mongoose = require("mongoose");

const savedMessageSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

const SavedMessage = mongoose.model("savedMessages", savedMessageSchema);

module.exports = SavedMessage;
