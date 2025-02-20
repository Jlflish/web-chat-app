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
    const socketInstance = io("http://192.168.0.105:5000", {
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

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    },
    chatContainer: {
      width: "80%",
      maxWidth: "600px",
      backgroundColor: "white", // 聊天框的背景颜色
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    },
    chatRecord: {
      maxHeight: "300px",
      overflowY: "auto",
      marginBottom: "20px",
    },
    form: {
      display: "flex",
      alignItems: "center",
    },
    input: {
      width: "80%",
      padding: "8px",
      marginRight: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    button: {
      padding: "8px 16px",
      borderRadius: "5px",
      border: "none",
      backgroundColor: "#4CAF50",
      color: "white",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatContainer}>
        <h1>全局聊天室</h1>
        <div style={styles.chatRecord}>
          <div>
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.username}:</strong> {msg.content}
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={handleSendMessage} style={styles.form}>
          <input
            type="text"
            placeholder="输入消息"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            发送
          </button>
        </form>
      </div>
    </div>
  );  
};

export default Chat;
