const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email }).catch((err) => {
    console.log(err);
  });
  if (user) {
    const isPasswordCorrect = await bcrypt.compare(user.password, password);
    if (isPasswordCorrect) {
      const token = jwt.sign({ id: user._id, name: user.name }, secret);
      return res.json({
        status: true,
        message: "Login Successful",
        user: user,
        token: token,
      });
    }
    return res.json({
      token: null,
      user: null,
      status: false,
      message: "Wrong password, please try again",
    });
  }
  return res.json({
    token: null,
    user: null,
    status: false,
    message: "No account found with entered email",
  });
};

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email: email }).catch((err) => {
    console.log(err);
  });
  if (user) {
    return res.json({
      token: null,
      user: null,
      status: false,
      message: "Account with email already exists, Try logging in instead!",
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const savedUser = newUser.save();
    const token = jwt.sign({ id: savedUser._id, name: savedUser.name }, secret);

    return res.json({
      user: savedUser,
      token: token,
      status: true,
      message: "Signed up successfully",
    });
  } catch (err) {
    console.log(err);
    return res.json({
      status: false,
      user: null,
      token: null,
      message: err.message,
    });
  }
};

const findUser = async (req, res, next, userId) => {
  try {
    const user = await User.findOne({ _id: userId }).catch((err) => {
      console.log(err);
    });
    if (!user) {
      return res.status(400).json({ status: false, message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

const getById = (req, res) => {
  const { user } = req;
  return res
    .status(200)
    .json({ status: true, user: user, message: "User found" });
};

const deleteUser = (req, res) => {
  const { user } = req;
  user
    .delete()
    .then(() => {
      return res.json({ status: true, message: "user deleted" });
    })
    .catch((err) => {
      return res.json({ status: false, message: err.message });
    });
};

const updateUserDetails = async (req, res) => {
  let { user } = req;
  const { update } = req.body;
  if (update._id) {
    return res.status(400).json({
      status: false,
      message: "Forbidden request, Id cannot be updated",
    });
  }
  user = { ...user, ...updated };
  user = await user.save();
  return res.json({ status: true, message: "Details updated", user: user });
};

const saveMessage = async (req, res) => {
  const { userId, message } = req.body;
  const user = await User.findOne({ _id: userId }).catch((err) => {
    return res.json({ status: false, message: err.message });
  });
  if (user) {
    user.savedMessages.push(message);
    await user.save();
    return res.json({ status: true });
  }
};

const deleteSavedMessage = async (req, res) => {
  const { userId, message } = req.body;
  const user = await User.findOne({ _id: userId }).catch((err) => {
    return res.json({ status: false, message: err.message });
  });
  if (user) {
    const index = user.savedMessages.findIndex(message);
    user.savedMessages.splice(index, 1);
    await user.save();
    return res.json({ status: true });
  }
};

module.exports = {
  login,
  signup,
  findUser,
  getById,
  deleteUser,
  updateUserDetails,
  saveMessage,
  deleteSavedMessage,
};
