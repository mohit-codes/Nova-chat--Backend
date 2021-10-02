const User = require("../models/user.model");
const SavedMessage = require("../models/savedMessage.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const Group = require("../models/group.model");
const { deleteMessages, encrypt } = require("./message.controller");

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email }).catch((err) => {
    console.log(err);
  });

  if (user) {
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
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

    const savedUser = await newUser.save();
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
    req.userInfo = user;
    next();
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

const getById = (req, res) => {
  const { userInfo } = req;
  return res
    .status(200)
    .json({ status: true, user: userInfo, message: "User found" });
};

const getByEmail = async (req, res) => {
  const { email } = req.params;
  const user = await User.findOne({ email: email }, "name _id email");
  if (user) {
    return res
      .status(200)
      .json({ status: true, user: user, message: "User found" });
  }
  return res.json({ status: false, user: null, message: "User not found" });
};

const deleteUser = (req, res) => {
  const { userInfo } = req;
  userInfo
    .delete()
    .then(() => {
      return res.json({ status: true, message: "user deleted" });
    })
    .catch((err) => {
      return res.json({ status: false, message: err.message });
    });
};

const updateUserDetails = async (req, res) => {
  let { userInfo } = req;
  const { update } = req.body;
  if (update._id) {
    return res.status(400).json({
      status: false,
      message: "Forbidden request, Id cannot be updated",
    });
  }
  userInfo = { ...userInfo, ...updated };
  userInfo = await userInfo.save();
  return res.json({ status: true, message: "Details updated", user: user });
};

const saveMessage = async (userId, message) => {
  const user = await User.findOne({ _id: userId });
  const encryptedMessage = encrypt(message);
  const newSavedMessage = new SavedMessage({
    owner: user._id,
    message: encryptedMessage.encryptedMessage,
    iv: encryptedMessage.iv,
    key: encryptedMessage.key,
  });
  const newMessage = await newSavedMessage.save();
  user.savedMessages.push(newMessage._id);
  await user.save();
  let info = {
    iv: newMessage.iv,
    key: newMessage.key,
    message: newMessage.message,
    createdAt: newMessage.createdAt,
    messageId: newMessage._id,
  };
  return info;
};

const fetchSavedMessages = async (req, res) => {
  const { userInfo } = req;
  const data = await SavedMessage.find({
    _id: { $in: userInfo.savedMessages },
  }).catch((err) => console.log(err));
  let result = [];
  for (const msg of data) {
    result.push({
      iv: msg.iv,
      key: msg.key,
      message: msg.message,
      createdAt: msg.createdAt,
      messageId: msg._id,
    });
  }
  return res.status(200).json({ success: true, savedMessages: result });
};

const deleteSavedMessage = async (req, res) => {
  const { userId, messageId } = req.body;
  const user = await User.findOne({ _id: userId }).catch((err) => {
    return res.json({ status: false, message: err.message });
  });
  await SavedMessage.findByIdAndDelete(messageId);
  if (user) {
    const index = user.savedMessages.indexOf(messageId);
    user.savedMessages.splice(index, 1);
    await user.save();
    return res.json({ status: true });
  }
};

const fetchGroupsByIds = async (req, res) => {
  const { userInfo } = req;
  const data = await Group.find({ _id: { $in: userInfo.groups } }).catch(
    (err) => console.log(err)
  );
  return res.status(200).json({ success: true, groups: data });
};

const fetchRecipientsByIds = async (req, res) => {
  const { userInfo } = req;
  const data = await User.find(
    { _id: { $in: userInfo.chats } },
    "_id name email"
  ).catch((err) => console.log(err));
  return res.status(200).json({ success: true, recipients: data });
};

const deleteRecipient = async (req, res) => {
  const { senderId, recipientId } = req.body;

  const user = await User.findOne({ _id: senderId }).catch((err) => {
    return res.json({ status: false, message: err.message });
  });
  const isMessagesDeleted = deleteMessages(senderId, recipientId);
  if (user && isMessagesDeleted) {
    const index = user.chats.indexOf(recipientId);
    user.chats.splice(index, 1);
    await user.save();
    return res.json({ status: true });
  }
  return res.json({ status: false, message: "user not found" });
};

module.exports = {
  login,
  signup,
  findUser,
  getById,
  getByEmail,
  deleteUser,
  updateUserDetails,
  saveMessage,
  deleteRecipient,
  deleteSavedMessage,
  fetchSavedMessages,
  fetchGroupsByIds,
  fetchRecipientsByIds,
};
