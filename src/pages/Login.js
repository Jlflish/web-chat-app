import { useRef, useState } from "react";
import axios from "axios";

const Login = () => {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [loading, setLoading] = useState(false); // 登录过程中防止重复提交
  const [error, setError] = useState(""); // 用于显示登录错误

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // 重置错误消息

    try {
      const res = await axios.post("http://192.168.0.105:5000/api/auth/login", {
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      window.location.href = "/chat"; // 登录成功后跳转到聊天页面
    } catch (err) {
      setError(err.response?.data?.message || "登录失败"); // 显示错误信息
    } finally {
      setLoading(false); // 登录请求完成，恢复按钮状态
    }
  };

  const handleRegisterRedirect = () => {
    window.location.href = "/register"; // 跳转到注册页面
  };

  return (
    <div>
      <h2>用户登录</h2>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* 显示错误信息 */}
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="用户名" ref={usernameRef} required />
        <input
          type="password"
          placeholder="密码"
          ref={passwordRef}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "登录中..." : "登录"} {/* 根据加载状态显示按钮文本 */}
        </button>
      </form>

      {/* 注册按钮 */}
      <div>
        <button onClick={handleRegisterRedirect}>没有账号? 去注册</button>
      </div>
    </div>
  );
};

export default Login;
