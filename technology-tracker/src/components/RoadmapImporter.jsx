import { useState } from "react";

function normalizeTech(item) {
  // Поддержка разных форматов API
  if (typeof item === "string") {
    return { name: item };
  }

  const name =
    item?.name ||
    item?.title ||
    item?.technology ||
    item?.tech ||
    item?.label ||
    "Unknown";

  return {
    name,
    description: item?.description || item?.summary || "",
    level: item?.level || "beginner",
    progress: item?.progress ?? 0,
    tags: item?.tags || [],
  };
}

export default function RoadmapImporter({ addTechnology }) {
  const [roadmapUrl, setRoadmapUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImport = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(roadmapUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // ожидаем либо массив, либо { technologies: [...] } / { items: [...] }
      const list = Array.isArray(data)
        ? data
        : data?.technologies || data?.items || [];

      for (const item of list) {
        const tech = normalizeTech(item);
        // добавляем через твой API-хук
        // (важно: addTechnology приходит ПРОПСОМ, не вызываем хук тут!)
        await addTechnology(tech);
      }
    } catch (e) {
      setError(e?.message || "Ошибка импорта");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
      <input
        type="text"
        value={roadmapUrl}
        onChange={(e) => setRoadmapUrl(e.target.value)}
        placeholder="Вставь URL API дорожной карты (JSON)"
      />

      <button onClick={handleImport} disabled={!roadmapUrl || loading}>
        {loading ? "Импорт..." : "Импортировать дорожную карту"}
      </button>

      {error && <div style={{ color: "crimson" }}>{error}</div>}
    </div>
  );
}
