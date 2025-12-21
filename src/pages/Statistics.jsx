import "../pages/pages.css";
import "./Statistics.css";
import ProgressBar from "../components/ProgressBar";

export default function Statistics({ technologies, progress }) {
  const total = technologies?.length || 0;

  const counts = technologies.reduce(
    (acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    },
    { "not-started": 0, "in-progress": 0, completed: 0 }
  );

  const maxCount = Math.max(1, counts["not-started"], counts["in-progress"], counts.completed);

  const bars = [
    { key: "not-started", label: "Не начато", value: counts["not-started"] },
    { key: "in-progress", label: "В процессе", value: counts["in-progress"] },
    { key: "completed", label: "Выполнено", value: counts.completed },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0 }}>Статистика</h1>
          <p style={{ margin: "6px 0 0", color: "#697086" }}>
            График прогресса и распределение по статусам.
          </p>
        </div>
      </div>

      <div className="page-card">
        <ProgressBar progress={progress} label="Общий прогресс" animated />
        <div style={{ marginTop: 8, color: "#697086" }}>
          Всего технологий: <strong>{total}</strong>
        </div>

        <div className="chart">
          {bars.map((b) => {
            const h = Math.round((b.value / maxCount) * 100);
            return (
              <div key={b.key} className="chart-item">
                <div className="chart-bar" aria-label={b.label}>
                  <div className="chart-bar__fill" style={{ height: `${h}%` }} />
                </div>
                <div className="chart-meta">
                  <span>{b.label}</span>
                  <strong>{b.value}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
