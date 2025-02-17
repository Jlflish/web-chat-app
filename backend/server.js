// backend/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/chat-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));


app.get('/', (req, res) => {
  res.send('Chat server is running');
});

app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.use("/api/auth", authRoutes);

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('send_message', async (message) => {
    const newMessage = new Message({ content: message });
    await newMessage.save();
    io.emit('receive_message', message);  // 广播消息
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
