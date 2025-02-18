import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const Chat = () => {
  const [message, setMessage] = useState(""); // 当前输入的消息
  const [messages, setMessages] = useState([]); // 所有聊天记录
  const [socket, setSocket] = useState(null); // socket.io 连接实例

  // 获取用户名和 token
  const username = localStorage.getItem("username");

  useEffect(() => {
    // 连接到 WebSocket 服务器
    const socketInstance = io("http://localhost:5000", {
      transports: ["polling", "websocket"],  // 确保使用轮询作为回退
    });
    
    setSocket(socketInstance);

    // 监听服务器发送的消息
    socketInstance.on("receive_message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // 清理 WebSocket 连接
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  // 发送消息
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      console.log('send message')
      const msg = { username, content: message };
      socket.emit("send_message", msg); // 发送消息到服务器
      setMessage(""); // 清空输入框
    }
  };

  return (
    <div>
      <h1>聊天室</h1>
      <div>
        <h2>聊天记录</h2>
        <div
          style={{
            height: "300px",
            overflowY: "scroll",
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.username}:</strong> {msg.content}
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="输入消息"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          style={{ width: "80%", padding: "8px" }}
        />
        <button type="submit" style={{ padding: "8px" }}>
          发送
        </button>
      </form>
    </div>
  );
};

export default Chat;
