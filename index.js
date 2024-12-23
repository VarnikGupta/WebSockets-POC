const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/room/:name", (req, res) => {
  res.sendFile(__dirname + "/room.html");
});

io.on("connection", (socket) => {
//   console.log("a user connected");

  socket.on("join", ({ room, username }) => {
    socket.join(room);
    socket.username = username; 
    console.log(`User ${username} joined room: ${room}`);

    socket.to(room).emit("message", {
      username: 'System',
      text: `${username} has joined the room`,
    });
  });

  socket.on("message", ({ room, username, msg }) => {
    // console.log(`Message from ${username} in room ${room}: ${msg}`);
    io.to(room).emit("message", { username, text: msg });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
