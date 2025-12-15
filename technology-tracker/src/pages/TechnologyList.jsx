import { useNavigate, Link } from "react-router-dom";
import "../pages/pages.css";
import TechnologyCard from "../components/TechnologyCard";
import QuickActions from "../components/QuickActions";
import ProgressBar from "../components/ProgressBar";

// ВАЖНО: “другой человек” сделал RoadmapImporter с пропсом onImport
import RoadmapImporter from "../components/RoadmapImporter.jsx";

export default function TechnologyList({
  technologies,
  progress,
  onMarkAllCompleted,
  onResetAll,

  // Практика 24 (данные из API + импорт)
  onImportAdd,
  loading,
  error,
  onRetry,
}) {
  const navigate = useNavigate();

  const openTech = (tech) => {
    navigate(`/technology/${tech.id ?? tech._id}`);
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

      {loading && <p>Загрузка...</p>}

      {error && (
        <div className="page-card" style={{ marginBottom: 12 }}>
          <p style={{ margin: 0, color: "crimson" }}>Ошибка: {error}</p>
          <button className="btn" onClick={onRetry} style={{ marginTop: 8 }}>
            Повторить
          </button>
        </div>
      )}

      {/* Импорт дорожных карт (шаблоны), как у другого человека:
          RoadmapImporter вызывает onImport(tech) :contentReference[oaicite:2]{index=2} */}
      <div className="page-card" style={{ marginBottom: 12 }}>
        <RoadmapImporter onImport={onImportAdd} />
      </div>

      <QuickActions
        onMarkAllCompleted={onMarkAllCompleted}
        onResetAll={onResetAll}
        technologies={technologies}
      />

      <main style={{ marginTop: 12 }}>
        <div className="technologies-grid">
          {technologies.map((tech) => (
            <TechnologyCard
              key={tech.id ?? tech._id}
              technology={tech}
              onOpen={openTech}
            />
          ))}
        </div>

        {!loading && technologies.length === 0 ? (
          <div className="page-card" style={{ marginTop: 12 }}>
            <p style={{ margin: 0 }}>Технологий пока нет.</p>
          </div>
        ) : null}
      </main>
    </div>
  );
}
