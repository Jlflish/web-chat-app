import React, { useState, useEffect } from "react";
import axios from "axios";

const FriendsList = ({ currentUser }) => {
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.get(`http://192.168.0.105:5000/api/friends/list/${currentUser}`);
        setFriends(res.data.friends);
        setFriendRequests(res.data.friendRequests);
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };
    fetchFriends();
  }, [currentUser]);

  const handleAddFriend = async () => {
    if (!searchUser.trim()) return;

    try {
      const res = await axios.post("http://192.168.0.105:5000/api/friends/send-request", {
        senderUsername: currentUser,
        receiverUsername: searchUser,
      });

      setMessage(res.data.message);
      setSearchUser("");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("添加失败，用户可能不存在");
      }
    }
  };

  const handleAcceptRequest = async (requesterUsername) => {
    try {
      const res = await axios.post("http://192.168.0.105:5000/api/friends/accept-request", {
        username: currentUser,
        requesterUsername: requesterUsername,
      });

      setMessage(res.data.message);
      setFriendRequests(friendRequests.filter((req) => req.username !== requesterUsername));
      setFriends((prev) => [...prev, { username: requesterUsername }]);
    } catch (err) {
      setMessage("同意请求失败");
    }
  };

  const handleDeclineRequest = async (requesterUsername) => {
    try {
      const res = await axios.post("http://192.168.0.105:5000/api/friends/decline-request", {
        username: currentUser,
        requesterUsername: requesterUsername,
      });

      setMessage(res.data.message);
      setFriendRequests(friendRequests.filter((req) => req.username !== requesterUsername));
    } catch (err) {
      setMessage("拒绝请求失败");
    }
  };

  const handleRemoveFriend = async (friendUsername) => {
    try {
      const res = await axios.post("http://192.168.0.105:5000/api/friends/remove-friend", {
        username: currentUser,
        friendUsername: friendUsername,
      });

      setMessage(res.data.message);
      setFriends(friends.filter((friend) => friend.username !== friendUsername));
    } catch (err) {
      setMessage("删除好友失败");
    }
  };

  return (
    <div className="friends-container">
      <h2>好友列表</h2>
      <ul>
        {friends.map((friend) => (
          <li key={friend.username}>
            {friend.username}
            <button onClick={() => handleRemoveFriend(friend.username)}>删除</button>
          </li>
        ))}
      </ul>

      <h3>好友请求</h3>
      <ul>
        {friendRequests.map((req) => (
          <li key={req.username}>
            {req.username}
            <button onClick={() => handleAcceptRequest(req.username)}>同意</button>
            <button onClick={() => handleDeclineRequest(req.username)}>拒绝</button>
          </li>
        ))}
      </ul>

      <div className="add-friend">
        <input
          type="text"
          placeholder="输入用户名添加好友"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
        />
        <button onClick={handleAddFriend}>添加</button>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
};

export default FriendsList;
