import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/pages.css";
import "./Login.css";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "password") {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);

      onLogin?.(username);
      navigate("/technologies", { replace: true });
      return;
    }

    alert("Неверные данные для входа (admin / password).");
  };

  return (
    <div className="page">
      <div className="page-card">
        <h1 style={{ marginTop: 0 }}>Вход</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Имя пользователя</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="btn-row">
            <button className="btn primary" type="submit">
              Войти
            </button>
          </div>

          <p style={{ margin: "8px 0 0", color: "#697086" }}>
            Тестовые данные: <strong>admin</strong> / <strong>password</strong>
          </p>
        </form>
      </div>
    </div>
  );
}
