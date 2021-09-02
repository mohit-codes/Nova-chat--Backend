const Group = require("../models/group.model");
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

module.export = {
  fetchAllPublicGroups,
  createGroup,
};
