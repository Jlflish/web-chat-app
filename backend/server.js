// backend/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",  // 允许前端访问
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
  origin: "http://localhost:3000",  // 允许来自这个域的请求
  methods: ["GET", "POST"],        // 允许的 HTTP 方法
}));

app.use(express.json());

app.use("/api/auth", authRoutes);


// app.post('/api/auth/register', (req, res) => {
//   const { username, password } = req.body;
//   if (!username || !password) {
//     return res.status(400).json({ message: '用户名和密码不能为空' });
//   }
//   // 处理注册逻辑
//   res.status(200).json({ message: '注册成功' });
// });

app.get('/', (req, res) => {
  res.send('Chat server is running');
});

// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     if (!username || !password) {
//       return res.status(400).json({ message: '用户名和密码不能为空' });
//     }

//     // 登录逻辑
//     // 假设这里是数据库查询或密码验证等逻辑
//     // 如果有错误，会被捕获并返回 500 错误

//     // 假设如果一切正常，返回一个成功的响应
//     res.status(200).json({ message: '登录成功' });

//   } catch (error) {
//     console.error('登录处理出错：', error);  // 打印详细错误信息
//     res.status(500).json({ message: '服务器错误' });
//   }
// });

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
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
