const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.use(express.json());

// 发送好友请求
router.post("/send-request", async (req, res) => {
  const { senderUsername, receiverUsername } = req.body;
  try {
    const sender = await User.findOne({ username: senderUsername });
    const receiver = await User.findOne({ username: receiverUsername });

    if (!sender || !receiver) {
      return res.status(404).json({ message: "用户不存在" });
    }

    if (senderUsername === receiverUsername) {
      return res.status(400).json({ message: "不能添加自己" });
    }

    if (receiver.friendRequests.includes(sender._id)) {
      return res.status(400).json({ message: "不能重复添加好友" });
    }

    receiver.friendRequests.push(sender._id);
    await receiver.save();

    res.status(200).json({ message: "好友请求已发送" });
  } catch (error) {
    res.status(500).json({ message: "服务器错误" });
  }
});

// 接受好友请求
router.post("/accept-request", async (req, res) => {
  const { username, requesterUsername } = req.body;

  try {
    const user = await User.findOne({ username });
    const requester = await User.findOne({ username: requesterUsername });

    if (!user || !requester) {
      return res.status(404).json({ message: "用户不存在" });
    }

    const requesterId = requester._id.toString();

    // 从好友请求列表移除
    user.friendRequests = user.friendRequests.filter(id => id.toString() !== requesterId);

    // 双方互加好友
    user.friends.push(requester._id);
    requester.friends.push(user._id);

    await user.save();
    await requester.save();

    res.status(200).json({ message: "已接受好友请求" });
  } catch (error) {
    res.status(500).json({ message: "服务器错误" });
  }
});

// 拒绝好友请求
router.post("/decline-request", async (req, res) => {
  const { username, requesterUsername } = req.body;

  try {
    const user = await User.findOne({ username });
    const requester = await User.findOne({ username: requesterUsername });

    if (!user || !requester) {
      return res.status(404).json({ message: "用户不存在" });
    }

    user.friendRequests = user.friendRequests.filter(id => id.toString() !== requester._id.toString());
    await user.save();

    res.json({ message: "好友请求已拒绝" });
  } catch (error) {
    res.status(500).json({ message: "服务器错误" });
  }
});

// 获取好友列表
// 获取好友列表 & 好友请求
router.get("/list/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate("friends", "username")
      .populate("friendRequests", "username");  // 确保返回 friendRequests

    if (!user) return res.status(404).json({ message: "用户不存在" });

    res.status(200).json({ 
      friends: user.friends || [], 
      friendRequests: user.friendRequests || [] 
    });
  } catch (error) {
    res.status(500).json({ message: "服务器错误" });
  }
});

// 删除好友
router.post("/remove-friend", async (req, res) => {
  const { username, friendUsername } = req.body;

  try {
    const user = await User.findOne({ username });
    const friend = await User.findOne({ username: friendUsername });

    if (!user || !friend) {
      return res.status(404).json({ message: "用户不存在" });
    }

    // 从好友列表中移除
    user.friends = user.friends.filter(id => id.toString() !== friend._id.toString());
    friend.friends = friend.friends.filter(id => id.toString() !== user._id.toString());

    await user.save();
    await friend.save();

    res.status(200).json({ message: "好友已删除" });
  } catch (error) {
    res.status(500).json({ message: "服务器错误" });
  }
});

module.exports = router;
