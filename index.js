const express = require("express");
const socket = require("socket.io");

// App setup
const PORT = 8080;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});

// Static files
app.use(express.static("public"));

// Socket setup
const io = socket(server);

// We use a Set to store users; Sets store unique values of any type
const activeUsers = new Set();

io.on("connection", function (socket) {
  socket.on("new user", function (data) {
    socket.userId = data;
    activeUsers.add(data);

    // Send a message to the console when a user connects
    console.log(`New user connected: ${data}`);
    
    // ... is the spread operator, adds to the set while retaining what was in there already
    io.emit("new user", [...activeUsers]);
  });

  socket.on("disconnect", function () {
    if (socket.userId) {
      const disconnectedUser = socket.userId;
      activeUsers.delete(disconnectedUser);

      // Send a message to the console when a user disconnects
      console.log(`User disconnected: ${disconnectedUser}`);
      
      // Emit an event to inform clients about the disconnected user
      io.emit("user disconnected", disconnectedUser);
    }
  });

  socket.on("chat message", function (data) {
    data.timestamp = Date.now();
    io.emit("chat message", data);
  });
});
