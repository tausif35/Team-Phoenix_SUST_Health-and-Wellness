const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);

let users = {};

let messages = {};

let emergencyChat = {};

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });

  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  // Emergency socket creation
  socket.on("broadcast-emergency", (room, userId, userType, cb) => {
    if (userType === "patient") {
      if (!emergencyChat[room]) {
        emergencyChat[room] = {
          patient: userId,
          doctor: "",
          messages: [],
        };
        socket.join(room);
        cb({ emergencyChat: emergencyChat[room], ...users });
      }
    } else if (userType === "doctor") {
      if (emergencyChat[roomm] && emergencyChat[room].doctor === "") {
        emergencyChat[room].doctor = userId;
        socket.join(room);
        cb({ emergencyChat: emergencyChat[room], ...users });
      }
    }
  });

  socket.on("send-emergency", (sentMessage) => {
    const room = sentMessage.room;
    if (emergencyChat[room]) {
      emergencyChat[room].messages.push(sentMessage);
      io.sockets.in(room).emit("receive-emergency", sentMessage);
    }
  });

  socket.on("join-room", (room, cb) => {
    // socket.emit("joined room", messages)
    socket.join(room);
    let objOnJoin = {};
    if (messages[room]) {
      cb({ messages: messages[room], ...users });
    } else {
      cb({ messages: [], ...users });
    }
  });

  //Group chat
  socket.on("sendAll", (sentMessage) => {
    if (!users[sentMessage.senderId]) {
      users[sentMessage.senderId] = [sentMessage];
    } else {
      let deleted = _.remove(users[sentMessage.senderId], (msgs) => {
        return (
          msgs.senderId === sentMessage.receiverId ||
          msgs.receiverId === sentMessage.receiverId
        );
      });
      users[sentMessage.senderId] = [
        sentMessage,
        ...users[sentMessage.senderId],
      ];
    }

    if (!users[sentMessage.receiverId]) {
      users[sentMessage.receiverId] = [sentMessage];
    } else {
      let deleted = _.remove(users[sentMessage.receiverId], (msgs) => {
        return (
          msgs.senderId === sentMessage.senderId ||
          msgs.receiverId === sentMessage.senderId
        );
      });
      users[sentMessage.receiverId] = [
        sentMessage,
        ...users[sentMessage.receiverId],
      ];
    }
    console.log(users);
    io.sockets.emit("getChatList", users);
  });

  //Get chat list
  socket.on("chatList", (id, cb) => {
    if (users[id]) {
      cb(users[id]);
    } else {
      cb([]);
    }
  });

  socket.on("send", (sentMessage) => {
    const room = sentMessage.room;
    if (messages[room]) {
      messages[room].push(sentMessage);
    } else {
      messages[room] = [sentMessage];
    }

    const obj = {
      sentMessage,
      users,
    };

    io.sockets.in(room).emit("receive", obj);
  });
});

server.listen(5005, () => console.log("server is running on port 5005"));
