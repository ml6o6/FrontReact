import { NavLink, Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useUi } from "../theme/UiContext.jsx";
import "./Navigation.css";

export default function Navigation({ isLoggedIn, username, onLogout }) {
  const { themeMode, toggleTheme, notify } = useUi();
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
              <span className="nav-user__name">
                Привет, {username || "user"}!
              </span>
              <Tooltip
                title={themeMode === "dark" ? "Светлая тема" : "Тёмная тема"}
              >
                <IconButton
                  size="small"
                  onClick={() => {
                    toggleTheme();
                    notify(
                      themeMode === "dark"
                        ? "Включена светлая тема"
                        : "Включена тёмная тема",
                      "info"
                    );
                  }}
                  aria-label="Переключить тему"
                  sx={{ mr: 1 }}
                >
                  {themeMode === "dark" ? (
                    <LightModeIcon fontSize="small" />
                  ) : (
                    <DarkModeIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
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
