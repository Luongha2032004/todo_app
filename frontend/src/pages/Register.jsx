import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!username || !password) {
      setErr("Nhập username và password");
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/register", { username, password });
      // Sau đăng ký tự động chuyển sang login
      navigate("/login");
    } catch (error) {
      setErr(error.response?.data?.msg || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{maxWidth:420, margin:"0 auto"}}>
      <h2>Đăng ký</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input className="input" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <div style={{color:"var(--danger)"}}>{err}</div>}
        <button className="btn-block" disabled={loading}>{loading ? "Đang xử lý..." : "Tạo tài khoản"}</button>
      </form>
      <p className="small" style={{marginTop:12}}>
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
    </div>
  );
}
