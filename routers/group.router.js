const express = require("express");
const router = express.Router();
const {
  create,
  addMember,
  getByCode,
  getById,
  removeMember,
  deleteGroup,
} = require("../controllers/group.controller");

router.route("/create").post(create);
router.route("/add_member").post(addMember);
router.route("/get_by_code/:groupCode").get(getByCode);
router.route("/get_by_id/:groupId").get(getById);
router.route("/remove_member").post(removeMember);
router.route("/:groupId").delete(deleteGroup);

module.exports = router;
