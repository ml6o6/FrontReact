import { useRef, useState } from "react";

export default function DataImporter({ onImport }) {
  const [importError, setImportError] = useState("");
  const [status, setStatus] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const validateImportData = (data) => {
    if (!data?.technologies || !Array.isArray(data.technologies)) {
      throw new Error("Неверный формат файла: отсутствует массив technologies");
    }

    data.technologies.forEach((tech, index) => {
      if (!tech?.title || !tech?.description) {
        throw new Error(`Технология #${index + 1}: отсутствует название или описание`);
      }
      if (String(tech.title).length > 50) {
        throw new Error(`Технология "${tech.title}": название слишком длинное`);
      }
    });

    return true;
  };

  const handleFileUpload = (file) => {
    setImportError("");
    setStatus("");

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".json")) {
      setImportError("Выберите JSON файл");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const fileContent = e.target?.result;
        const importedData = JSON.parse(String(fileContent || "{}"));

        validateImportData(importedData);

        const importedTechnologies = importedData.technologies.map((t) => ({
          ...t,
          // поддержка формата экспорта
          notes: t.notes ?? t.userNotes ?? "",
          status: t.status ?? t.userStatus ?? "not-started",
          deadline: t.deadline ?? t.userDeadline ?? "",
        }));

        onImport?.(importedTechnologies);
        setStatus(`Импортировано ${importedTechnologies.length} технологий`);
      } catch (err) {
        setImportError(err?.message || "Ошибка импорта");
      }
    };

    reader.onerror = () => setImportError("Ошибка чтения файла");
    reader.readAsText(file);

    // Сбрасываем input чтобы можно было выбрать тот же файл снова
    if (inputRef.current) inputRef.current.value = "";
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFileUpload(file);
  };

  return (
    <div className="page-card">
      <h2 style={{ marginTop: 0 }}>Импорт данных</h2>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        style={{
          border: "2px dashed #e7e7ee",
          borderRadius: 16,
          padding: 14,
          background: isDragging ? "#f6f8ff" : "#fff",
          display: "grid",
          gap: 10,
        }}
      >
        <p style={{ margin: 0, color: "#697086" }}>
          Перетащите сюда JSON файл или выберите его вручную
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".json,application/json"
          onChange={(e) => handleFileUpload(e.target.files?.[0])}
        />

        {importError && (
          <div role="alert" style={{ color: "#d64545" }}>
            Ошибка импорта: {importError}
          </div>
        )}

        {status && (
          <div role="status" style={{ color: "#2e7d32" }}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
