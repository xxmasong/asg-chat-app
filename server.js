const users = require("./routes/api/users");
const messages = require("./routes/api/messages");

const express = require("express");
const app = express();

// Middleware
const cors = require('cors');
app.use(cors());
app.use(express.json());

// Body Parser middleware to parse request bodies
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Port that the webserver listens to
const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);

// Assign socket object to every request
const io = require('socket.io')(server);
app.use(function (req, res, next) {
  req.io = io;
  next();
});

// Passport middleware
const passport = require("passport");
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);

// Database configuration
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Successfully Connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/users", users);
app.use("/api/messages", messages);

