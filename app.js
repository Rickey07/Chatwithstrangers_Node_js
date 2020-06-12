const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 5000;
const path = require("path");
// const siofu = require('socketio-file-upload');
// const socket = io.listen(port);

// For serving the static files
app.use("/public", express.static("/public"));
app.use(express.static(path.join(__dirname, "public")));

// Set the view engine
app.set("view engine", "ejs");

// Listen when user joins
const users = {};

io.on("connection", (socket) => {
  socket.on("new-connection", (userName) => {
    // Welcome Message to every user that joins
    socket.emit("welcome", userName);
    users[socket.id] = userName;
    socket.broadcast.emit("user-connection", userName);
  });

  // Send and recieve message Listener
  socket.on("sendMsg", (userMsg) => {
    console.log(userMsg);
    socket.broadcast.emit("receiveMsg", {
      userMsg: userMsg,
      userName: users[socket.id],
    });
  });
  // Catching Typing Event
  // Typing event
  socket.on("typing", (userName) => {
    socket.broadcast.emit("isTyping", userName);
  });

  // On disconnect
  socket.on("disconnect", (userName) => {
    io.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});

http.listen(port , () => {
  console.log(`App Started listening on port ${port}`);
});
