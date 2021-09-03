const express = require("express");
const router = express.Router();
const {
  createGroup,
  addMember,
  removeMember,
  deleteGroup,
  updateGroup,
} = require("../controllers/group.controller");

router.route("/create").post(createGroup);
router.route("/add_member").post(addMember);
router.route("/update_group").put(updateGroup);
router.route("/remove_member").post(removeMember);
router.route("/:groupId").delete(deleteGroup);

module.exports = router;
