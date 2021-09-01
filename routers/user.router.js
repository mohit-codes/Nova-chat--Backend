const express = require("express");
const router = express.Router();
const {
  login,
  signup,
  updateUserDetails,
  getById,
  getByEmail,
  findUser,
  deleteUser,
  deleteRecipient,
  deleteSavedMessage,
  saveMessage,
  fetchGroupsByIds,
  fetchRecipientsByIds,
} = require("../controllers/user.controller");

router.route("/login").post(login);
router.route("/signup").post(signup);

router.route("/saveMessage").post(saveMessage);
router.route("/delete_saved_message").delete(deleteSavedMessage);
router.param("userId", findUser);
router.route("/get_by_id/:userId").get(getById);
router.route("/get_by_email/:email").get(getByEmail);
router.route("/recipients/:userId").get(fetchRecipientsByIds);
router.route("/groups/:userId").get(fetchGroupsByIds);
router.route("/update/:userId").put(updateUserDetails);
router.route("/deleteRecipient").delete(deleteRecipient);
router.route("/:userId").delete(deleteUser);

module.exports = router;
