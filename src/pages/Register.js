import { useRef, useState } from "react";
import axios from "axios";

const Register = () => {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [loading, setLoading] = useState(false); // 注册过程中防止重复提交
  const [error, setError] = useState(""); // 用于显示注册错误

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // 重置错误消息
  
    try {
      const payload = {
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      };
  
      console.log("Sending data to backend:", payload);  // 打印请求数据
  
      await axios.post("http://192.168.0.105:5000/api/auth/register", payload);
  
      alert("注册成功！"); // 成功后提示用户
      window.location.href = "/login"; // 注册成功后跳转到登录页
    } catch (err) {
      setError(err.response?.data?.message || "注册失败"); // 显示错误信息
    } finally {
      setLoading(false); // 注册请求完成，恢复按钮状态
    }
  };

  return (
    <div>
      <h2>用户注册</h2>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* 显示错误信息 */}
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="用户名" ref={usernameRef} required />
        <input
          type="password"
          placeholder="密码"
          ref={passwordRef}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "注册中..." : "注册"} {/* 根据加载状态显示按钮文本 */}
        </button>
      </form>
    </div>
  );
};

export default Register;
