import { useMemo, useState } from "react";

export default function DataExporter({ technologies = [] }) {
  const [exportFormat, setExportFormat] = useState("json");
  const [includeUserData, setIncludeUserData] = useState(true);

  const canExport = useMemo(() => Array.isArray(technologies) && technologies.length > 0, [technologies]);

  const exportData = () => {
    const payload = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      technologies: includeUserData
        ? technologies.map((tech) => ({
            ...tech,
            userNotes: tech.notes || "",
            userStatus: tech.status || "not-started",
            userDeadline: tech.deadline || "",
          }))
        : technologies.map(({ notes, status, deadline, ...tech }) => tech),
    };

    let dataStr = "";
    let fileType = "application/json";
    let fileName = `technology-tracker-${new Date().toISOString().split("T")[0]}.json`;

    if (exportFormat === "json") {
      dataStr = JSON.stringify(payload, null, 2);
    } else {
      // csv reserved for future
      dataStr = JSON.stringify(payload, null, 2);
    }

    const blob = new Blob([dataStr], { type: fileType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-card">
      <h2 style={{ marginTop: 0 }}>Экспорт данных</h2>

      <div style={{ display: "grid", gap: 10 }}>
        <div className="form-group">
          <label htmlFor="export-format">Формат экспорта</label>
          <select id="export-format" value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
            <option value="json">JSON</option>
            <option value="csv" disabled>
              CSV (скоро)
            </option>
          </select>
        </div>

        <div className="form-group">
          <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={includeUserData}
              onChange={(e) => setIncludeUserData(e.target.checked)}
            />
            Включить мои заметки и прогресс
          </label>
          <span className="help-text" style={{ color: "#697086" }}>
            При включении будут экспортированы ваши заметки, статусы и дедлайны
          </span>
        </div>

        {!canExport && (
          <div className="export-warning" role="alert" style={{ color: "#8a6d3b" }}>
            ⚠ Нет данных для экспорта. Добавьте технологии в трекер.
          </div>
        )}

        <button
          onClick={exportData}
          disabled={!canExport}
          className="btn primary"
          aria-describedby={canExport ? "export-help" : "export-warning"}
        >
          📥 Экспортировать данные
        </button>

        <div id="export-help" className="help-text" style={{ color: "#697086" }}>
          Файл будет сохранён на вашем устройстве
        </div>
      </div>
    </div>
  );
}
