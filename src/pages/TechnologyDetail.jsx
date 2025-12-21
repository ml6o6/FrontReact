import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../pages/pages.css";
import "./TechnologyDetail.css";
import TechnologyNotes from "../components/TechnologyNotes";

const STATUS_LABELS = {
  "not-started": "Не начато",
  "in-progress": "В процессе",
  completed: "Выполнено",
};

export default function TechnologyDetail({
  technologies,
  onStatusChange,
  onNotesChange,
  onLoadResources,
}) {
  const { techId } = useParams();
  const id = Number.parseInt(techId, 10);

  const technology = useMemo(() => {
    return technologies?.find((t) => t.id === id) || null;
  }, [technologies, id]);

  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [resourcesError, setResourcesError] = useState(null);

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

  const handleLoadResources = async () => {
    if (typeof onLoadResources !== "function") return;

    try {
      setResourcesLoading(true);
      setResourcesError(null);
      await onLoadResources(technology.id);
    } catch (e) {
      setResourcesError(e?.message || "Не удалось загрузить ресурсы");
    } finally {
      setResourcesLoading(false);
    }
  };

  const resources = Array.isArray(technology.resources) ? technology.resources : [];

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">{technology.title}</h2>
        <div className="page-actions">
          <Link className="btn" to="/technologies">
            ← Назад
          </Link>
        </div>
      </div>

      <div className="page-main">
        <div className="page-card">
          <h3 style={{ marginTop: 0 }}>Описание</h3>
          <p style={{ margin: 0 }}>{technology.description || "—"}</p>
        </div>

        <div className="page-card">
          <h3 style={{ marginTop: 0 }}>Дополнительные ресурсы (из API)</h3>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn"
              onClick={handleLoadResources}
              disabled={resourcesLoading}
            >
              {resourcesLoading ? "Загрузка..." : "Загрузить ресурсы"}
            </button>

            {technology.apiSource === "dummyjson" && technology.apiId ? (
              <span style={{ opacity: 0.8 }}>
                DummyJSON ID: <strong>{technology.apiId}</strong>
              </span>
            ) : null}
          </div>

          {resourcesError ? (
            <div style={{ marginTop: 8, color: "crimson" }}>{resourcesError}</div>
          ) : null}

          {resources.length === 0 ? (
            <p style={{ marginTop: 10, opacity: 0.85 }}>Пока ресурсов нет.</p>
          ) : (
            <ul style={{ marginTop: 10 }}>
              {resources.slice(0, 10).map((url, idx) => (
                <li key={idx}>
                  <a href={url} target="_blank" rel="noreferrer">
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          )}
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
