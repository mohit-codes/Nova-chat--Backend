require("dotenv").config();
const port = process.env.PORT || 8080;
const express = require("express");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");
const { initializeDBConnection } = require("./config/db.config");
const userRouter = require("./routers/user.router");
const messageRouter = require("./routers/message.router");
const groupRouter = require("./routers/group.router");
const {
  createGroupMessage,
  createMessage,
  startMessage,
} = require("./controllers/message.controller");
const { saveMessage } = require("./controllers/user.controller");
const authenticate = require("./middleware/authenticate");
const errorHandler = require("./middleware/errorHandler");
const routeHandler = require("./middleware/routeHandler");
const { ALLOWED_ORIGINS } = require("./utils/constants.js");

const app = express();
app.use(express.json());
app.use(cors({ origin: ALLOWED_ORIGINS }));
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: ALLOWED_ORIGINS } });

// called before any route
initializeDBConnection();

app.get("/", (req, res) => {
  return res.send({ message: "Welcome to Nova-server" });
});

app.use("/users", userRouter);
app.use("/messages", authenticate, messageRouter);
app.use("/groups", authenticate, groupRouter);

app.use(routeHandler);
app.use(errorHandler);

let connectedUsers = new Map();
let groups = {};

io.on("connection", (socket) => {
  let { id } = socket.client;

  socket.on("connectUser", ({ name }) => {
    //  When the client sends 'name', we store the 'name',
    //  'socket.client.id', and 'socket.id in a Map structure
    connectedUsers.set(name, [socket.client.id, socket.id]);
    io.emit("onlineUsers", Array.from(connectedUsers.keys()));
  });

  socket.on("disconnect", () => {
    for (let key of connectedUsers.keys()) {
      if (connectedUsers.get(key)[0] === id) {
        connectedUsers.delete(key);
        break;
      }
    }
    io.emit("onlineUsers", Array.from(connectedUsers.keys()));
  });

  socket.on("startMessage", ({ senderId, receiverEmail }) => {
    startMessage(senderId, receiverEmail);
  });

  socket.on("sendMessage", ({ sender, receiver, message }) => {
    const { email, name } = receiver;
    let receiverSocketId =
      connectedUsers.get(name) === undefined
        ? false
        : connectedUsers.get(name)[1];
    let senderSocketId = connectedUsers.get(sender.name)[1];
    createMessage(sender._id, email, message).then(
      ({ info, isNewRecipient }) => {
        if (isNewRecipient && receiverSocketId) {
          io.to(receiverSocketId).emit("newRecipient", info);
        } else if (receiverSocketId) {
          io.to(receiverSocketId).emit("message", info);
        }
        io.to(senderSocketId).emit("message", info);
      }
    );
  });

  socket.on("saveMessage", ({ user, message }) => {
    let userSocketId = connectedUsers.get(user.name)[1];
    saveMessage(user._id, message).then((res) => {
      io.to(userSocketId).emit("savedMessage", res);
    });
  });

  socket.on("sendGroupMessage", ({ sender, group, message }) => {
    createGroupMessage(sender, group._id, message).then((res) => {
      io.to(`${group.name}:${group.groupCode}`).emit("groupMessage", res);
    });
  });

  socket.on("joinGroup", ({ userInfo, group }) => {
    socket.join(`${group.name}:${group.groupCode}`);
    if (!groups[group.name]) {
      groups[group.name] = [userInfo];
    } else if (!groups[group.name].find((user) => user._id === userInfo._id)) {
      groups[group.name].push(userInfo);
    }
  });
});

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
