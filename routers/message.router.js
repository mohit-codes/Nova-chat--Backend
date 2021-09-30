const express = require("express");
const router = express.Router();
const {
  getMessages,
  getGroupMessages,
  deleteMessageById,
} = require("../controllers/message.controller");

router.route("/get_messages").post(getMessages);
router.route("/get_group_messages").post(getGroupMessages);
router.route("/:messageId").delete(deleteMessageById);
module.exports = router;
