const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});

const users = {};
const rooms = {};
const messageStatuses = {};

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
socket.on("login", (data) => {
  const { username} = data;
  users[socket.id] = { username};
  console.log(`User with ID: ${socket.id} logged in as ${username}`);
});

socket.on("logout", () => {
  const user = users[socket.id];
  if (user) {
    delete users[socket.id];
    console.log(`User with ID: ${socket.id} logged out`);
  }
});

  socket.on("join_room", (data) => {
    const { username, room } = data;
    if (!rooms[room]) {
      rooms[room] = [];
    }
    rooms[room].push(username);
    users[socket.id] = { username, room };
    socket.join(room);
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
  });

  socket.on("send_message", (data) => {
    console.log('users',users);
    console.log('rooms',rooms);
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("update_status", (data) => {
    messageStatuses[data.id] = data.status;
    console.log('data', data);
    io.to(data.room).emit("status_updated", data);
  });

  socket.on("message_viewed", (data) => {
    io.to(data.room).emit("message_viewed", { id: data.id, room: data.room });
  });

  socket.on("leave_room", async (data) => {
    socket.leave(data.room);
    console.log(`User with ID: ${socket.id} left room: ${data.room}`);
    if (rooms[data.room]) {
      rooms[data.room] = rooms[data.room].filter(user => user !== users[socket.id].username);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
    const user = users[socket.id];
    if (user) {
      const { room } = user;
      if (rooms[room]) {
        rooms[room] = rooms[room].filter(username => username !== user.username);
      }
      delete users[socket.id];
    }
  });
});

server.listen(PORT, () => {
  console.log("SERVER RUNNING");
});



// const express = require("express");
// const http = require("http");
// const cors = require("cors");
// const { Server } = require("socket.io");

// const PORT = process.env.PORT || 3001;
// const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

// const app = express();
// app.use(cors());

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: CORS_ORIGIN,
//     methods: ["GET", "POST"],
//   },
// });

// // Простые структуры для хранения пользователей и комнат
// const users = {}; // { socketId: { username, room } }
// const rooms = {}; // { room: [username1, username2, ...] }
// const messageStatuses = {}; // { messageId: status }

// io.on("connection", (socket) => {
//   console.log(`User Connected: ${socket.id}`);

//   socket.on("join_room", (data) => {
//     const { username, room } = data;

//     // Проверка, есть ли такая комната, если нет, создаем
//     if (!rooms[room]) {
//       rooms[room] = [];
//     }

//     // Добавляем пользователя в комнату и объект пользователей
//     rooms[room].push(username);
//     users[socket.id] = { username, room };

//     socket.join(room);
//     console.log(`User with ID: ${socket.id} joined room: ${room}`);
//   });

//   socket.on("send_message", (data) => {
//     socket.to(data.room).emit("receive_message", data);
//   });

//   socket.on("update_status", (data) => {
//     messageStatuses[data.id] = data.status; // Обновляем статус (например, 'viewed')
//     console.log('data', data);

//     io.to(data.room).emit("status_updated", data); // Отправляем обновленный статус всем в комнате
//   });

//   socket.on("message_viewed", (data) => {
//     console.log('Message viewed:', data); // Для отладки
//     io.to(data.room).emit("message_viewed", { id: data.id, room: data.room }); // Отправляем обновление статуса всем пользователям в комнате
//   });

//   socket.on("leave_room", async (data) => {
//     socket.leave(data.room);
//     console.log(`User with ID: ${socket.id} left room: ${data.room}`);

//     // Удаляем пользователя из комнаты и объекта пользователей
//     if (rooms[data.room]) {
//       rooms[data.room] = rooms[data.room].filter(user => user !== users[socket.id].username);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log(`User Disconnected: ${socket.id}`);
//     // Удаляем пользователя из комнаты, если он отключился
//     const user = users[socket.id];
//     if (user) {
//       const { room } = user;
//       if (rooms[room]) {
//         rooms[room] = rooms[room].filter(username => username !== user.username);
//       }
//       delete users[socket.id];
//     }
//   });
// });

// server.listen(PORT, () => {
//   console.log("SERVER RUNNING");
// });





