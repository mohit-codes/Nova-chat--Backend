const express = require("express");
const router = express.Router();
const {
  login,
  signup,
  updateUserDetails,
  getById,
  findUser,
  deleteUser,
} = require("../controllers/user.controller");

router.route("/login").post(login);
router.route("/signup").post(signup);

router.param("userId", findUser);
router.route("/get_by_Id/:userId").get(getById);
router.route("/update/:userId").put(updateUserDetails);
router.route("/:userId").delete(deleteUser);

module.exports = router;
