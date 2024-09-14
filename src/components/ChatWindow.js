import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import UserList from "./UserList";
import DiceRoller from "./DiceRoller";

const socket = io("http://localhost:3001");

socket.on("connect", () => {
  console.log("Connected to server");
});

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    socket.on("message", ({ id, message }) => {
      console.log("Received message:", message);
      setMessages((messages) => [...messages, { id, message }]);
    });

    socket.on("clients", (clients) => {
      console.log("Received clients:", clients);
      setClients(clients);
    });

    socket.on("roll", ({id, count, sides, result}) => {
      console.log(`Received roll: ${count}d${sides} = ${result}`);
      setMessages((messages) => [
        ...messages,
        { id, message: `rolled ${count}d${sides} and got ${result}` },
      ]);
    });

    return () => {
      socket.off("message");
      socket.off("clients");
      socket.off("roll");
    };
  }, []);

  const sendMessage = (message) => {
    console.log("Sending message:", message);
    socket.emit("message", message);
  };

  const rollDice = (count, sides) => {
    console.log(`Rolling ${count}d${sides}...`);
    socket.emit("roll", count, sides);
  };

  return (
    <div className="chat-window">
      <div className="chat-container">
        <MessageList messages={messages} />
        <div className="utilities">
          <UserList clients={clients} />
          <DiceRoller rollDice={rollDice} />
        </div>
      </div>
      <MessageInput sendMessage={sendMessage} />
    </div>
  );
};

export default ChatWindow;
