import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login"; // 登录页面组件
import Register from "./pages/Register"; // 注册页面组件
import Chat from "./pages/Chat"; // 聊天页面组件

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* 根路径跳转到登录页面 */}
        <Route path="/login" element={<Login />} /> {/* 登录页面 */}
        <Route path="/register" element={<Register />} /> {/* 注册页面 */}
        <Route path="/chat" element={<Chat />} /> {/* 聊天页面 */}
        {/* 其他页面的路由 */}
      </Routes>
    </Router>
  );
};

export default App;
