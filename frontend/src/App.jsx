import React from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TodoPage from "./pages/TodoPage";
import { getToken, removeToken } from "./utils/auth";

export default function App() {
  const token = getToken();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/" className="brand">TodoApp</Link>
        <nav>
          {token ? (
            <>
              <button className="btn-ghost" onClick={() => navigate("/")}>Trang chủ</button>
              <button className="btn-danger" onClick={handleLogout}>Đăng xuất</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn">Đăng nhập</Link>
              <Link to="/register" className="btn">Đăng ký</Link>
            </>
          )}
        </nav>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={token ? <TodoPage /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <small>© {new Date().getFullYear()} — Todo App</small>
      </footer>
    </div>
  );
}
