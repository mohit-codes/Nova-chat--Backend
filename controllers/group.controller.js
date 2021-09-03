const Group = require("../models/group.model");
const Message = require("../models/message.model");
const User = require("../models/user.model");
const randomCode = () => Math.floor(Math.random() * (1000 - 1) + 1);

const createGroup = async (req, res) => {
  const { adminId, groupName, isPublic, description } = req.body;
  const user = await User.findById(adminId);
  if (user) {
    const newGroup = new Group({
      name: groupName,
      admin: adminId,
      code: randomCode,
      isPublic: isPublic,
      description: description,
    });
    const groupInfo = await newGroup.save();
    user.groups.push(groupInfo._id);
    await user.save();
    return res.json({
      status: true,
      message: "Group created",
      group: groupInfo,
    });
  }
  return res.json({ status: false, message: "user not found" });
};

const fetchAllPublicGroups = (req, res) => {
  Group.find({ isPublic: true }, "name _id description")
    .then((groups) => {
      return res.json({ status: true, groups: groups });
    })
    .catch((err) => {
      console.log(err);
      return res.json({ status: false, message: err.message });
    });
};

const addMember = async (req, res) => {
  const { memberEmail, groupId } = req.body;
  const user = await User.findOne({ email: memberEmail });
  if (user) {
    const group = await Group.findById(groupId);
    if (group) {
      group.members.push(userId);
      await group.save();
      user.groups.push(groupId);
      await user.save();
      return res.json({ status: true, message: "added to group" });
    }
    return res.json({ status: false, message: "invalid group id" });
  }
  return res.json({ status: false, message: "User not found" });
};

const updateGroup = async (req, res) => {
  const { groupId, name, description, isPublic } = req.body;
  const group = await Group.findById(groupId);
  if (group) {
    group.name = name;
    group.description = description;
    group.isPublic = isPublic;
    await group.save();
    return res.json({ status: true, message: "group updated" });
  }
  return res.json({ status: false, message: "Invalid group id" });
};

const removeMember = async (req, res) => {
  try {
    const { groupId, memberId } = req.body;
    const group = await Group.findById(groupId);
    const user = await User.findById(memberId);
    let index = group.members.indexOf(memberId);
    group.members.slice(index, 1);
    index = user.groups.indexOf(groupId);
    user.groups.slice(index, 1);
    await user.save();
    await group.save();
    return res.json({ status: true, message: "member removed" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: false, message: err.message });
  }
};

const deleteGroup = (req, res) => {
  const { groupId } = req.params;
  const group = await Group.findById(groupId);
  if (group) {
    await User.updateMany(
      { _id: { $in: group.members } },
      { $pull: { groups: group._id } }
    );
    await Message.deleteMany({ receiver: group._id });
    Group.deleteOne({ _id: groupId })
      .then(() => {
        return res.json({ status: true, message: "group deleted" });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ status: false, message: err.message });
      });
  }
};

module.export = {
  fetchAllPublicGroups,
  createGroup,
  removeMember,
  addMember,
  updateGroup,
  deleteGroup,
};
