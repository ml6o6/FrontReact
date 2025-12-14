import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import "../pages/pages.css";
import "./TechnologyDetail.css";
import TechnologyNotes from "../components/TechnologyNotes";

const STATUS_LABELS = {
  "not-started": "Не начато",
  "in-progress": "В процессе",
  completed: "Выполнено",
};

export default function TechnologyDetail({ technologies, onStatusChange, onNotesChange }) {
  const { techId } = useParams();
  const id = Number.parseInt(techId, 10);

  const technology = useMemo(() => {
    return technologies?.find((t) => t.id === id) || null;
  }, [technologies, id]);

  if (!technology) {
    return (
      <div className="page">
        <div className="page-card">
          <h1 style={{ marginTop: 0 }}>Технология не найдена</h1>
          <p style={{ color: "#697086" }}>
            Технология с ID <strong>{techId}</strong> не существует.
          </p>
          <Link className="btn" to="/technologies">
            ← Назад к списку
          </Link>
        </div>
      </div>
    );
  }

  const setStatus = (status) => onStatusChange?.(technology.id, status);

  return (
    <div className="page">
      <div className="page-header">
        <Link className="btn" to="/technologies">
          ← Назад
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0 }}>{technology.title}</h1>
          <div className="meta-row" style={{ marginTop: 6 }}>
            <span>Категория: {technology.category}</span>
            <span>Статус: {STATUS_LABELS[technology.status] ?? "—"}</span>
          </div>
        </div>
      </div>

      <div className="detail-grid">
        <div className="page-card">
          <h3 style={{ marginTop: 0 }}>Описание</h3>
          <p style={{ margin: 0 }}>{technology.description || "—"}</p>
        </div>

        <div className="page-card">
          <h3 style={{ marginTop: 0 }}>Статус изучения</h3>
          <div className="status-buttons">
            {Object.keys(STATUS_LABELS).map((key) => (
              <button
                key={key}
                type="button"
                className={"btn" + (technology.status === key ? " active" : "")}
                onClick={() => setStatus(key)}
              >
                {STATUS_LABELS[key]}
              </button>
            ))}
          </div>
        </div>

        <div className="page-card">
          <TechnologyNotes
            techId={technology.id}
            notes={technology.notes}
            onNotesChange={onNotesChange}
          />
        </div>
      </div>
    </div>
  );
}
