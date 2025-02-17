import { useEffect, useRef, useState } from "react";
import axios from "axios";

const Login = () => {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [loading, setLoading] = useState(true); // 防止页面闪烁

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      window.location.href = "/chat"; // 避免已登录用户回到登录页
    } else {
      setLoading(false); // 只有未登录时才渲染表单
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);
        window.location.href = "/chat";
      } else {
        alert("登录失败，未返回 token");
      }
    } catch (err) {
      alert(err.response?.data?.message || "登录失败");
    }
  };

  if (loading) return <h2>加载中...</h2>; // 避免无限跳转导致页面闪烁

  return (
    <div>
      <h2>用户登录</h2>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="用户名" ref={usernameRef} required />
        <input type="password" placeholder="密码" ref={passwordRef} required />
        <button type="submit">登录</button>
      </form>
    </div>
  );
};

export default Login;
