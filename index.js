require("dotenv").config();
const port = process.env.PORT || 3000;
const express = require("express");
const cors = require("cors");
const socketio = require("socket.io");
const { initializeDBConnection } = require("./config/db.config");
const userRouter = require("./routers/user.router");

const app = express();
app.use(express.json());
app.use(cors());

// called before any route
initializeDBConnection();

app.get("/", (req, res) => {
  return res.send({ message: "Welcome to Nova-server" });
});

app.use("/users", userRouter);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
