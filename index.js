require("dotenv").config();
const port = process.env.PORT || 3000;
const express = require("express");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");
const { initializeDBConnection } = require("./config/db.config");
const userRouter = require("./routers/user.router");
const userMessage = require("./routers/message.router");
const {
  createGroupMessage,
  createMessage,
  startMessage,
} = require("./controllers/message.controller");
const {
  addUser,
  addUserIntoGroup,
  getUser,
  groups,
  removeUser,
  users,
} = require("./routers/onlineUsers");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.json());
app.use(cors());

// called before any route
initializeDBConnection();

app.get("/", (req, res) => {
  return res.send({ message: "Welcome to Nova-server" });
});

app.use("/users", userRouter);
app.use("/messages", userMessage);

io.on("connection", (socket) => {
  console.log("joined");

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });

  socket.on("startMessage", (sender, receiverEmail, senderEmail) => {
    startMessage(sender, receiverEmail);
    addUser({ id: socket.id, email: senderEmail });
  });

  socket.on("sendMessage", (sender, receiverEmail, message) => {
    createMessage(sender, receiverEmail, message).then((res) => {
      io.emit("message", res);
    });
  });

  socket.on("sendGroupMessage", (sender, group, message) => {
    createGroupMessage(sender, group._id, message).then((res) => {
      io.to(res.group.code).emit("groupMessage", res);
    });
  });

  socket.on("joinGroup", ({ userInfo, group }) => {
    socket.join(group);
    addUserIntoGroup({ userInfo, group });
  });
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
