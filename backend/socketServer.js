const _ = require("lodash");
const io = require("socket.io")(5000, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

let users = {};

let messages = {};

let groupChat = {};

let emergencyChat = {};

io.on("connection", (socket) => {
  socket.on("hello", (data) => {
    console.log(data.data);
  });
  /* socket.on("join-groupChat", (room, cb) => {
      // socket.emit("joined room", messages)
      socket.join(room);
      if (groupChat[room]) {
        cb({ messages: groupChat[room], ...users });
      } else {
        cb({ messages: [], ...users });
      }
    }); */
  /*
    socket.on("sendGroup", (sentMessage) => {
        console.log(sentMessage);
        const room = sentMessage.room;
        if (groupChat[room]) {
            groupChat[room].push(sentMessage);
        } else {
            groupChat[room] = [sentMessage];
        }
    
        io.sockets.in(room).emit("recieveGroup", sentMessage);
    }); */

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
      io.sockets.in(room).emit("recieve-emergency", sentMessage);
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

    io.sockets.in(room).emit("recieve", obj);
  });
  socket.on("join-vid-room", (roomId, userId) => {
    socket.join(roomId); // Join the room
    socket.broadcast.emit("user-connected", userId); // Tell everyone else in the room that we joined

    // Communicate the disconnection
    socket.on("disconnect", () => {
      socket.broadcast.emit("user-disconnected", userId);
    });
  });
});
