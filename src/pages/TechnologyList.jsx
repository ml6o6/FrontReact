import { useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../pages/pages.css";

import TechnologyCard from "../components/TechnologyCard";
import QuickActions from "../components/QuickActions";
import ProgressBar from "../components/ProgressBar";
import RoadmapImporter from "../components/RoadmapImporter.jsx";

function mapSearchItemToTech(item) {
  return {
    title: item?.title ?? "Без названия",
    description: item?.description ?? "",
    category: item?.category ?? "imported",
    status: "not-started",
    progress: 0,
    apiSource: item?.apiSource ?? "dummyjson",
    apiId: item?.apiId ?? item?.id,
    resources: Array.isArray(item?.resources) ? item.resources : [],
  };
}

export default function TechnologyList({
  technologies,
  progress,
  onMarkAllCompleted,
  onResetAll,

  onImportAdd,

  onSearch,

  loading,
  error,
  onRetry,
}) {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [results, setResults] = useState([]);

  const timerRef = useRef(null);
  const abortRef = useRef(null);

  const runSearch = async (query) => {
    const q = query.trim();

    if (!q) {
      setResults([]);
      setSearchError(null);
      setSearchLoading(false);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setSearchLoading(true);
    setSearchError(null);

    try {
      if (typeof onSearch !== "function") {
        throw new Error("Ошибка: функция поиска не подключена");
      }

      const items = await onSearch(q, abortRef.current.signal);
      setResults(Array.isArray(items) ? items : []);
    } catch (e) {
      if (e?.name !== "AbortError") {
        setSearchError(
          e?.message || "Ошибка: не удалось выполнить поиск по API"
        );
        setResults([]);
      }
    } finally {
      setSearchLoading(false);
    }
  };

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => runSearch(value), 500);
  };

  const openTech = (tech) => {
    if (tech?.id != null) navigate(`/technology/${tech.id}`);
  };

  const safeTechnologies = Array.isArray(technologies) ? technologies : [];
  const hasAny = safeTechnologies.length > 0;

  const progressValue = useMemo(() => {
    if (typeof progress === "number") return progress;
    const total = safeTechnologies.length || 1;
    const completed = safeTechnologies.filter(
      (t) => t.status === "completed"
    ).length;
    return Math.round((completed / total) * 100);
  }, [progress, safeTechnologies]);

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Технологии</h2>
        <div className="page-actions">
          <Link className="btn" to="/add-technology">
            ＋ Добавить
          </Link>
        </div>
      </div>

      {error ? (
        <div className="page-card" style={{ marginBottom: 12 }}>
          <p style={{ margin: 0, color: "crimson" }}>{error}</p>
          <button className="btn" onClick={onRetry} style={{ marginTop: 10 }}>
            Попробовать снова
          </button>
        </div>
      ) : null}

      <div className="page-card" style={{ marginBottom: 12 }}>
        <h3 style={{ marginTop: 0 }}>Импорт дорожной карты</h3>
        <RoadmapImporter addTechnology={onImportAdd} />
      </div>

      <div className="page-card" style={{ marginBottom: 12 }}>
        <h3 style={{ marginTop: 0 }}>Поиск</h3>

        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              value={searchTerm}
              onChange={onSearchChange}
              placeholder="Поиск по API (например: react...)"
              style={{ width: "100%", paddingRight: 40 }}
            />
            <span
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                opacity: 0.8,
                minWidth: 20,
                textAlign: "center",
              }}
              aria-live="polite"
            >
              {searchLoading ? "⌛" : ""}
            </span>
          </div>

          <div style={{ minHeight: 18, color: "crimson" }}>
            {searchError ? searchError : ""}
          </div>

          {results.length > 0 ? (
            <div style={{ display: "grid", gap: 8 }}>
              {results.map((item) => (
                <div
                  key={item.apiId ?? item.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 10,
                    alignItems: "center",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    padding: 10,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{item.title}</div>
                    <div style={{ opacity: 0.85, fontSize: 13 }}>
                      {item.description}
                    </div>
                  </div>

                  <button
                    className="btn"
                    onClick={() => {
                      const tech = mapSearchItemToTech(item);
                      onImportAdd?.(tech);
                    }}
                  >
                    Добавить
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <QuickActions
        onMarkAllCompleted={onMarkAllCompleted}
        onResetAll={onResetAll}
      />
      <ProgressBar value={progressValue} />

      <main className="page-main">
        {loading ? (
          <div className="page-card">
            <p style={{ margin: 0 }}>Загрузка списка технологий…</p>
          </div>
        ) : (
          <>
            {hasAny ? (
              <div className="tech-grid">
                {safeTechnologies.map((t) => (
                  <TechnologyCard
                    key={t.id ?? t.title}
                    technology={t}
                    onOpen={() => openTech(t)}
                  />
                ))}
              </div>
            ) : (
              <div className="page-card" style={{ marginTop: 12 }}>
                <p style={{ margin: 0 }}>Технологий пока нет.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
