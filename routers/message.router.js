const express = require("express");
const router = express.Router();
const {
  getMessages,
  getGroupMessages,
} = require("../controllers/message.controller");

router.route("/get_messages").post(getMessages);
router.route("/get_group_messages").post(getGroupMessages);

module.exports = router;
