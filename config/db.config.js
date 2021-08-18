const mongoose = require("mongoose");
require("dotenv").config();

function initializeDBConnection() {
  mongoose
    // eslint-disable-next-line no-undef
    .connect(process.env.DB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    .then(() => console.log("successfully connected"))
    .catch((error) => console.error("mongoose connection failed...", error));
}

module.exports = { initializeDBConnection };
