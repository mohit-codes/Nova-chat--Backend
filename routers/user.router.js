const express = require("express");
const router = express.Router();
const {
  login,
  signup,
  updateUserDetails,
  getById,
  findUser,
  deleteUser,
  deleteSavedMessage,
  saveMessage,
} = require("../controllers/user.controller");

router.route("/login").post(login);
router.route("/signup").post(signup);

router.route("/saveMessage").post(saveMessage);
router.route("/delete_saved_message").delete(deleteSavedMessage);
router.param("userId", findUser);
router.route("/get_by_Id/:userId").get(getById);
router.route("/update/:userId").put(updateUserDetails);
router.route("/:userId").delete(deleteUser);

module.exports = router;
