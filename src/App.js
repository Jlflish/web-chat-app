import { useEffect, useState } from "react";
import Chat from "./pages/Chat";
import Login from "./pages/Login";

function App() {
  const [page, setPage] = useState(null); // 默认是 null，表示还在检查状态

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setPage("chat"); // 如果有 token，跳转到聊天页
    } else {
      setPage("login"); // 如果没有 token，跳转到登录页
    }
  }, []); // 只在首次加载时运行

  if (page === null) return <h2>加载中...</h2>; // 等待状态检查完成

  return (
    <div>
      {page === "chat" ? <Chat /> : <Login />}
    </div>
  );
}

export default App;
