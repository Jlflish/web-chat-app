import { useEffect, useState } from "react";

const Chat = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      window.location.href = "/login";
    }
  }, []);

  if (isAuthenticated === null) return <h2>加载中...</h2>; // 防止组件短暂渲染再跳转

  return <h1>欢迎来到聊天室</h1>;
};

export default Chat;
