import { NavLink, Link } from "react-router-dom";
import "./Navigation.css";

export default function Navigation({ isLoggedIn, username, onLogout }) {
  return (
    <nav className="main-navigation">
      <div className="nav-brand">
        <Link to="/">
          <h2>🚀 Трекер технологий</h2>
        </Link>
      </div>

      <ul className="nav-menu">
        <li>
          <NavLink to="/" end>
            Главная
          </NavLink>
        </li>

        <li>
          <NavLink to="/technologies">Технологии</NavLink>
        </li>

        <li>
          <NavLink to="/statistics">Статистика</NavLink>
        </li>

        <li>
          <NavLink to="/settings">Настройки</NavLink>
        </li>

        <li>
          <NavLink to="/add-technology">+ Добавить</NavLink>
        </li>

        <li className="nav-user">
          {isLoggedIn ? (
            <>
              <span className="nav-user__name">Привет, {username || "user"}!</span>
              <button type="button" className="nav-logout" onClick={onLogout}>
                Выйти
              </button>
            </>
          ) : (
            <NavLink to="/login">Войти</NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
}
