import { useMemo, useState } from "react";
import "../pages/pages.css";
import DataExporter from "../components/DataExporter";
import DataImporter from "../components/DataImporter";

const STATUS_OPTIONS = [
  { value: "not-started", label: "Не начато" },
  { value: "in-progress", label: "В процессе" },
  { value: "completed", label: "Выполнено" },
];

export default function Settings({
  isLoggedIn,
  username,
  onLogout,
  onMarkAllCompleted,
  onResetAll,
  onClearAllNotes,
  onResetData,
  technologies = [],
  onImportTechnologies,
  onBulkUpdate,
}) {
  const [bulkStatus, setBulkStatus] = useState("in-progress");
  const [bulkDeadline, setBulkDeadline] = useState("");

  const hasTech = useMemo(
    () => Array.isArray(technologies) && technologies.length > 0,
    [technologies]
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0 }}>Настройки</h1>
          <p style={{ margin: "6px 0 0", color: "#697086" }}>
            Пользователь:{" "}
            <b>{isLoggedIn ? username || "Гость" : "не авторизован"}</b>
          </p>
        </div>

        <div className="btn-row">
          <button className="btn" onClick={onLogout}>
            Выйти
          </button>
        </div>
      </div>

      <div className="page-card" style={{ marginBottom: 12 }}>
        <h2 style={{ marginTop: 0 }}>Быстрые действия</h2>
        <div className="btn-row">
          <button
            className="btn primary"
            onClick={onMarkAllCompleted}
            disabled={!hasTech}
          >
            Отметить всё выполненным
          </button>
          <button className="btn" onClick={onResetAll} disabled={!hasTech}>
            Сбросить статусы
          </button>
          <button className="btn" onClick={onClearAllNotes} disabled={!hasTech}>
            Очистить заметки
          </button>
          <button
            className="btn"
            disabled={!hasTech}
            onClick={() => {
              const cleaned = (technologies || []).filter(
                (t) => t.apiSource !== "dummyjson"
              );

              if (
                confirm(
                  `Удалить импортированные из DummyJSON?\n` +
                    `Будет удалено: ${
                      (technologies || []).length - cleaned.length
                    }`
                )
              ) {
                onImportTechnologies?.(cleaned);
              }
            }}
          >
            Удалить импортированные
          </button>

          <button
            className="btn"
            onClick={() => {
              if (confirm("Сбросить данные к исходным?")) onResetData();
            }}
          >
            Сбросить данные
          </button>
        </div>
      </div>

      <div className="page-card" style={{ marginBottom: 12 }}>
        <h2 style={{ marginTop: 0 }}>Массовое редактирование</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          <div className="form-group">
            <label htmlFor="bulk-status">Новый статус</label>
            <select
              id="bulk-status"
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="bulk-deadline">Новый дедлайн</label>
            <input
              id="bulk-deadline"
              type="date"
              value={bulkDeadline}
              onChange={(e) => setBulkDeadline(e.target.value)}
            />
          </div>
        </div>

        <div className="btn-row" style={{ marginTop: 12 }}>
          <button
            className="btn primary"
            disabled={!hasTech}
            onClick={() =>
              onBulkUpdate?.({ status: bulkStatus, deadline: bulkDeadline })
            }
          >
            Применить ко всем
          </button>
          <button
            className="btn"
            onClick={() => {
              setBulkDeadline("");
              setBulkStatus("in-progress");
            }}
          >
            Сбросить выбор
          </button>
        </div>
      </div>

      <DataImporter onImport={onImportTechnologies} />
      <div style={{ height: 12 }} />
      <DataExporter technologies={technologies} />
    </div>
  );
}
