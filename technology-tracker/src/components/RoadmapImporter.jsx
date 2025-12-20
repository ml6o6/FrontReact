import { useState } from "react";

function normalizeTech(item) {
  if (typeof item === "string") {
    const title = item.trim() || "Unknown";
    return {
      title,
      description: "",
      category: "imported",
      status: "not-started",
      notes: "",
      resources: [],
    };
  }

  const title =
    item?.title ||
    item?.name ||
    item?.technology ||
    item?.tech ||
    item?.label ||
    "Unknown";

  return {
    title: String(title),
    description: item?.description || item?.summary || "",
    category: item?.category || "imported",
    status: item?.status || "not-started",
    notes: item?.notes || "",
    resources: Array.isArray(item?.images)
      ? item.images
      : Array.isArray(item?.resources)
      ? item.resources
      : [],
    apiSource: item?.id ? "dummyjson" : item?.apiSource,
    apiId: item?.id ?? item?.apiId,
  };
}

export default function RoadmapImporter({ addTechnology, onImport }) {
  const add = addTechnology || onImport;

  const [roadmapUrl, setRoadmapUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImport = async () => {
    if (!roadmapUrl || !add) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(roadmapUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      const list = Array.isArray(data)
        ? data
        : data?.technologies || data?.items || data?.products || [];

      if (!Array.isArray(list) || list.length === 0) {
        throw new Error("В ответе API нет списка элементов для импорта");
      }

      for (const item of list) {
        const tech = normalizeTech(item);
        await add(tech);
      }

      alert(`Успешно импортировано: ${list.length}`);
      setRoadmapUrl("");
    } catch (e) {
      console.error(e);
      setError(e?.message || "Ошибка импорта");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="roadmap-importer">
      <div style={{ display: "grid", gap: 8 }}>
        <input
          type="text"
          value={roadmapUrl}
          onChange={(e) => setRoadmapUrl(e.target.value)}
          placeholder="Вставь URL API дорожной карты (JSON)"
        />

        <button
          onClick={handleImport}
          disabled={!roadmapUrl || loading || !add}
        >
          {loading ? "Импорт..." : "Импортировать"}
        </button>

        {error && <div style={{ color: "crimson" }}>{error}</div>}
        {!add && (
          <div style={{ color: "crimson" }}>
            Не передана функция добавления (addTechnology/onImport).
          </div>
        )}
      </div>
    </div>
  );
}
