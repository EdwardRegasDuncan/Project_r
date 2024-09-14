const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const Message = require("./models/Message");

const app = express();
app.use(cors());

mongoose.connect("mongodb://localhost:27017/chat", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let connectedClients = [];

io.on("connection", async (socket) => {
  console.log("New client connected: ", socket.id);
  connectedClients.push(socket.id);

  try {
    const messages = await Message.find().sort({ timestamp: 1 }).exec();
    socket.emit("messages", messages);
  } catch (err) {
    console.log("Error fetching messages");
  }

  io.emit("clients", connectedClients);

  socket.on("message", async (message) => {
    if (message.startsWith("!")) {
      const parts = message.slice(1).split("d");
      const modifierParts = parts[1].split("+");
      const sides = parseInt(modifierParts[0], 10);
      const modifier = modifierParts[1] ? parseInt(modifierParts[1], 10) : 0;
      const count = parseInt(parts[0], 10);
      if (!isNaN(count) && !isNaN(sides)) {
        console.log(`Sending roll command to client`);
        const result = rollDice(count, sides, modifier);
        io.emit("roll", { id: socket.id, count, sides, modifier, result });
      } else {
        console.log("Invalid roll command");
      }
    } else {
      io.emit("message", { id: socket.id, message });

      const newMessage = new Message({ id: socket.id, message });
      try {
        await newMessage.save();
      } catch (err) {
        console.error(err);
      }
    }
    console.log("Received message:", message);
  });

  const rollDice = (count, sides, modifier) => {
    const total = Array.from(
      { length: count },
      () => Math.floor(Math.random() * sides) + 1
    ).reduce((acc, curr) => acc + curr, 0);
    return total + (modifier || 0);
  };

  socket.on("roll", (count, sides, modifier) => {
    const result = rollDice(count, sides, modifier);
    console.log(
      `Rolling ${count}d${sides} + ${modifier} for client ${socket.id}: ${result}`
    );
    io.emit("roll", { id: socket.id, count, sides, modifier, result });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected ", socket.id);
    connectedClients = connectedClients.filter((id) => id !== socket.id);
    io.emit("clients", connectedClients);
  });
});

const PORT = 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
