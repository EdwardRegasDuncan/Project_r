const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let connectedClients = [];

io.on("connection", (socket) => {
  console.log("New client connected: ", socket.id);
  connectedClients.push(socket.id);

  io.emit("clients", connectedClients);

  socket.on("message", (message) => {
    if (message.startsWith("!")) {
      const parts = message.slice(1).split("d");
      const count = parseInt(parts[0], 10);
      const sides = parseInt(parts[1], 10);
      if (!isNaN(count) && !isNaN(sides)) {
        console.log(`Sending roll command to client`);
        const result = rollDice(count, sides);
        io.emit("roll", { id: socket.id, count, sides, result });
      } else {
        console.log("Invalid roll command");
      }
    } else {
      io.emit("message", { id: socket.id, message });
    }
    console.log("Received message:", message);
  });
  
  const rollDice = (count, sides) => {
    return Array.from(
      { length: count },
      () => Math.floor(Math.random() * sides) + 1
    ).reduce((acc, curr) => acc + curr, 0);
  };
  
  socket.on("roll", (count, sides) => {
    const result = rollDice(count, sides);
    console.log(`Rolling ${count}d${sides} for client ${socket.id}: ${result}`);
    io.emit("roll", { id: socket.id, count, sides, result });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected ", socket.id);
    connectedClients = connectedClients.filter((id) => id !== socket.id);
    io.emit("clients", connectedClients);
  });
});

const PORT = 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
