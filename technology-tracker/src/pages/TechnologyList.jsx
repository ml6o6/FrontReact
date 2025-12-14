import { useNavigate, Link } from "react-router-dom";
import "../pages/pages.css";
import TechnologyCard from "../components/TechnologyCard";
import QuickActions from "../components/QuickActions";
import ProgressBar from "../components/ProgressBar";

export default function TechnologyList({
  technologies,
  progress,
  onMarkAllCompleted,
  onResetAll,
}) {
  const navigate = useNavigate();

  const openTech = (tech) => {
    navigate(`/technology/${tech.id}`);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0 }}>Все технологии</h1>
          <p style={{ margin: "6px 0 0", color: "#697086" }}>
            Кликни по карточке, чтобы открыть страницу деталей (параметр в URL).
          </p>
        </div>

        <Link className="btn primary" to="/add-technology">
          + Добавить технологию
        </Link>
      </div>

      <div className="page-card" style={{ marginBottom: 12 }}>
        <ProgressBar progress={progress} label="Общий прогресс" animated />
      </div>

      <QuickActions
        onMarkAllCompleted={onMarkAllCompleted}
        onResetAll={onResetAll}
        technologies={technologies}
      />

      <main style={{ marginTop: 12 }}>
        <div className="technologies-grid">
          {technologies.map((tech) => (
            <TechnologyCard key={tech.id} technology={tech} onOpen={openTech} />
          ))}
        </div>

        {technologies.length === 0 ? (
          <div className="page-card" style={{ marginTop: 12 }}>
            <p style={{ margin: 0 }}>Технологий пока нет.</p>
          </div>
        ) : null}
      </main>
    </div>
  );
}
