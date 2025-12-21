import { Link } from "react-router-dom";
import ProgressHeader from "../components/ProgressHeader";
import "../pages/pages.css";

export default function Home({ technologies, isLoggedIn }) {
  const total = technologies?.length || 0;
  const counts = technologies?.reduce(
    (acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    },
    { "not-started": 0, "in-progress": 0, completed: 0 }
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0 }}>Добро пожаловать!</h1>
        </div>

        {isLoggedIn ? (
          <Link className="btn primary" to="/technologies">
            Перейти к технологиям →
          </Link>
        ) : (
          <Link className="btn primary" to="/login">
            Войти →
          </Link>
        )}
      </div>

      <div className="page-card">
        <ProgressHeader total={total} counts={counts} />
        <div className="btn-row" style={{ marginTop: 12 }}>
          <Link className="btn" to="/technologies">
            Открыть список
          </Link>
          <Link className="btn" to="/statistics">
            Статистика
          </Link>
          <Link className="btn" to="/settings">
            Настройки
          </Link>
        </div>
      </div>
    </div>
  );
}
