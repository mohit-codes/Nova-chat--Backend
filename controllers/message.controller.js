const Group = require("../models/group.model");
const Message = require("../models/message.model");
const User = require("../models/user.model");

const createMessage = async (senderId, receiverEmail, message) => {
  let info = null;
  let isNewRecipient = false;
  const user = await User.findOne({ _id: senderId }).catch((err) => {
    console.log(err);
  });
  if (user) {
    const receiver = await User.findOne({ email: receiverEmail });
    if (receiver) {
      if (!receiver.chats.includes(senderId)) {
        isNewRecipient = true;
        receiver.chats.push(senderId);
        await receiver.save();
      }
      const newMessage = new Message({
        sender: senderId,
        receiver: receiver._id,
        message: message,
      });
      await newMessage.save();
      info = {
        sender: { name: user.name, email: user.email, _id: user._id },
        receiver: {
          name: receiver.name,
          _id: receiver._id,
          email: receiver.email,
        },
        message: message,
        createdAt: message.createdAt,
        messageId: newMessage._id,
      };
    }
  }
  return { info, isNewRecipient };
};

const createGroupMessage = async (senderId, groupId, message) => {
  let info = null;
  const user = await User.findOne({ _id: senderId }).catch((err) => {
    console.log(err);
  });
  if (user) {
    const group = await Group.findOne({ _id: groupId });
    if (group) {
      const newMessage = new Message({
        sender: senderId,
        receiver: group._id,
        message: message,
      });
      await newMessage.save();
      info = {
        sender: { name: user.name, email: user.email, _id: user._id },
        receiver: {
          name: group.name,
          members: group.members,
          groupCode: group.groupCode,
          _id: group._id,
        },
        message: message,
        createdAt: message.createdAt,
        messageId: newMessage._id,
      };
    }
  }
  return info;
};

const startMessage = async (senderId, receiverEmail) => {
  const user = await User.findOne({ _id: senderId });
  if (user) {
    const receiver = await User.findOne({ email: receiverEmail });
    if (receiver) {
      if (!user.chats.includes(senderId) && user._id !== receiver._id) {
        user.chats.push(receiver._id);
        await user
          .save()
          .then(() => {
            return true;
          })
          .catch(() => {
            return null;
          });
      }
    } else {
      return null;
    }
  } else {
    return null;
  }
};

const getMessages = (req, res) => {
  const { userId, receiverId } = req.body;
  User.findOne({ _id: userId }, (err, user) => {
    if (err) {
      return res.status(500).json({ status: false, message: err.message });
    } else if (!user) {
      return res.json({ status: false, message: "user not exist" });
    } else {
      User.findOne({ _id: receiverId }, (err, receiver) => {
        if (err) {
          return res.status(500).json({ status: false, message: err.message });
        } else if (!receiver) {
          return res
            .status()
            .json({ status: false, message: "receiver not exist" });
        } else {
          Message.find({ sender: userId, receiver: receiverId })
            .then((messagesSentBySender) => {
              Message.find(
                { sender: receiverId, receiver: userId },
                (err, messagesSentByReceiver) => {
                  let conversation = messagesSentBySender.concat(
                    messagesSentByReceiver
                  );
                  conversation.sort((a, b) => {
                    return new Date(a.createdAt) - new Date(b.createdAt);
                  });
                  let result = [];
                  conversation.forEach((message) => {
                    let info;
                    if (String(message.sender) === String(userId)) {
                      info = {
                        sender: {
                          name: user.name,
                          email: user.email,
                          id: user._id,
                        },
                        receiver: {
                          name: receiver.name,
                          email: receiver.email,
                          id: receiver._id,
                        },
                        message: message.message,
                        createdAt: message.createdAt,
                        messageId: message._id,
                      };
                    } else {
                      info = {
                        receiver: {
                          name: user.name,
                          email: user.email,
                          id: user._id,
                        },
                        sender: {
                          name: receiver.name,
                          email: receiver.email,
                          id: receiver._id,
                        },
                        createdAt: message.createdAt,
                        message: message.message,
                        messageId: message._id,
                      };
                    }
                    result.push(info);
                  });
                  return res.json({ status: true, messages: result });
                }
              );
            })
            .catch((err) => {
              console.log(err);
              return res.json({ status: false, message: err.message });
            });
        }
      });
    }
  });
};

const deleteMessages = (senderId, receiverId) => {
  Message.deleteMany({ sender: senderId, receiver: receiverId })
    .then(() => {
      const boolResult = Message.deleteMany({
        receiver: senderId,
        sender: receiverId,
      })
        .then(() => {
          return true;
        })
        .catch((err) => {
          console.log(err);
          return false;
        });
      return boolResult;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

// A mongoose query can be executed in one of two ways.
// First, if you pass in a callback function, Mongoose will execute the query asynchronously and pass the
// results to the callback.
// A query also has a .then() function, and thus can be used as a promise.

const getGroupMessages = (req, res) => {
  const { userId, groupCode } = req.body;
  User.findOne({ _id: userId }, (err, user) => {
    if (err) {
      return res.json({ status: false, message: err.message });
    }
    if (!user) {
      return res.json({ status: false, message: "user not found" });
    }
    Group.findOne({ code: groupCode }, (err, group) => {
      if (err) {
        return res.json({ status: false, message: err.message });
      }
      if (!group) {
        return res.json({ status: false, message: "group not found" });
      }
      Message.find({ receiver: group._id })
        .then((messages) => {
          // let result = [];
          // // Now, for each msg find out the sender
          // messages.forEach((msg) => {
          //   if(msg.sender !== user._id){
          //     const user = await User.findOne({_id})
          //   }
          // });
          return res.json({ status: true, messages: messages });
        })
        .catch((err) => {
          return res.json({ status: false, message: err.message });
        });
    });
  });
};

module.exports = {
  getMessages,
  createGroupMessage,
  createMessage,
  deleteMessages,
  getGroupMessages,
  startMessage,
};
