import { Link } from "react-router-dom";
import "../pages/pages.css";

export default function NotFound() {
  return (
    <div className="page">
      <div className="page-card">
        <h1 style={{ marginTop: 0 }}>404</h1>
        <p style={{ color: "#697086" }}>
          Такой страницы нет. Проверь URL или вернись на главную.
        </p>
        <Link className="btn" to="/">
          На главную
        </Link>
      </div>
    </div>
  );
}
