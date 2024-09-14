import React, {useEffect, useRef} from "react";
import "../App.css";

const MessageList = ({ messages }) => {
  const messagesListRef = useRef(null);

  useEffect(() => {
    if (messagesListRef.current) {
      messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="message-list" ref={messagesListRef}>
      {messages.map((msg, index) => (
        <div key={index} className="message">
          <strong>{msg.id}:</strong> {msg.message}
        </div>
      ))}
    </div>
  )
}

export default MessageList;
