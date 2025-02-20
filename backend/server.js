// backend/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",  // 允许所有IP访问
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],  // 如果有必要，允许其他请求头
  },
});

const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require("./api/auth");
const Message = require("./models/Message");

mongoose.connect('mongodb://localhost/chat-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.use(cors({
  origin: "*",  // 允许来自这个域的请求
  methods: ["GET", "POST"],        // 允许的 HTTP 方法
}));

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get('/', (req, res) => {
  res.send('Chat server is running');
});

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('send_message', async (message) => {
    try {
      const newMessage = new Message({
        username: message.username,
        content: message.content
      });
      await newMessage.save();
      console.log('get a message from user')
      io.emit('receive_message', message);  // 广播消息
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });
  
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => console.log('Server running on port 5000'));

