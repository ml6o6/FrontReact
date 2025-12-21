import { useMemo, useState } from "react";
import useLocalStorage from "./useLocalStorage";

const DUMMY_PRODUCTS_URL = "https://dummyjson.com/products";
const DUMMY_SEARCH_URL = "https://dummyjson.com/products/search?q=";

const initialTechnologies = [
  {
    id: 1,
    title: "React Components",
    description: "Изучение базовых компонентов",
    status: "not-started",
    notes: "",
    category: "frontend",
    resources: [],

    difficulty: "beginner",
    deadline: "",
  },
  {
    id: 2,
    title: "Node.js Basics",
    description: "Основы серверного JavaScript",
    status: "not-started",
    notes: "",
    category: "backend",
    resources: [],

    difficulty: "beginner",
    deadline: "",
  },
  {
    id: 3,
    title: "PostgreSQL",
    description: "Запросы и проектирование базы данных",
    status: "not-started",
    notes: "",
    category: "database",
    resources: [],

    difficulty: "beginner",
    deadline: "",
  },
  {
    id: 4,
    title: "Express.js",
    description: "Роутинг, middleware, REST API",
    status: "not-started",
    notes: "",
    category: "backend",
    resources: [],
  },
  {
    id: 5,
    title: "HTML & CSS",
    description: "Верстка, адаптивность, стили",
    status: "not-started",
    notes: "",
    category: "frontend",
    resources: [],
  },
  {
    id: 6,
    title: "React State",
    description: "useState, производные данные, ререндеры",
    status: "not-started",
    notes: "",
    category: "frontend",
    resources: [],
  },
];

function calculateProgress(list) {
  if (!Array.isArray(list) || list.length === 0) return 0;
  const done = list.filter((t) => t.status === "completed").length;
  return Math.round((done / list.length) * 100);
}

function normalizeFromDummyProduct(p) {
  return {
    id: p?.id,
    title: p?.title ?? "Без названия",
    description: p?.description ?? "",
    status: "not-started",
    notes: "",
    category: "imported",
    apiSource: "dummyjson",
    apiId: p?.id,
    resources: Array.isArray(p?.images) ? p.images : [],
  };
}

export default function useTechnologiesApi() {
  const [technologies, setTechnologies] = useLocalStorage(
    "technologies",
    initialTechnologies
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const progress = useMemo(
    () => calculateProgress(technologies),
    [technologies]
  );

  const refetch = async () => {
    setLoading(false);
    setError(null);
    setTechnologies(initialTechnologies);
  };

  // Добавление технологии (страница AddTechnology и импорт)
  const addTechnology = async (techData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 150));

      const safe = {
        title:
          String(techData?.title ?? techData?.name ?? "").trim() ||
          "Без названия",
        description: String(techData?.description ?? "").trim(),
        category: String(techData?.category ?? "other").trim() || "other",
        status: techData?.status ?? "not-started",
        notes: techData?.notes ?? "",
        resources: Array.isArray(techData?.resources) ? techData.resources : [],
        difficulty: techData?.difficulty ?? "beginner",
        deadline: techData?.deadline ?? "",
        apiSource: techData?.apiSource,
        apiId: techData?.apiId,
        createdAt: new Date().toISOString(),
      };

      const newTech = {
        id: Date.now() + Math.floor(Math.random() * 10000),
        ...safe,
        progress:
          safe.status === "completed"
            ? 100
            : safe.status === "in-progress"
            ? 50
            : 0,
      };

      setTechnologies((prev) => [...(prev || []), newTech]);
      return newTech;
    } catch (e) {
      console.error(e);
      throw new Error("Не удалось добавить технологию");
    }
  };

  const updateTechnology = async (techId, updates) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 80));
      setTechnologies((prev) =>
        (prev || []).map((tech) =>
          tech.id === techId
            ? {
                ...tech,
                ...updates,
                progress:
                  typeof updates?.progress === "number"
                    ? updates.progress
                    : updates?.status === "completed"
                    ? 100
                    : updates?.status === "in-progress"
                    ? 50
                    : tech.progress ?? 0,
              }
            : tech
        )
      );
    } catch (e) {
      console.error(e);
      throw new Error("Не удалось обновить технологию");
    }
  };

  const deleteTechnology = async (techId) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 80));
      setTechnologies((prev) => (prev || []).filter((t) => t.id !== techId));
    } catch (e) {
      console.error(e);
      throw new Error("Не удалось удалить технологию");
    }
  };

  const searchByQuery = async (query, signal) => {
    const q = String(query || "").trim();
    if (!q) return [];

    const res = await fetch(
      `${DUMMY_SEARCH_URL}${encodeURIComponent(q)}&limit=12`,
      { signal }
    );

    if (!res.ok) {
      throw new Error("Ошибка: не удалось выполнить поиск по API");
    }

    const data = await res.json();
    const products = Array.isArray(data?.products) ? data.products : [];
    return products.map(normalizeFromDummyProduct);
  };

  const loadAdditionalResources = async (techId) => {
    const tech = (technologies || []).find((t) => t.id === techId);
    if (!tech) return;

    try {
      let product = null;

      if (tech.apiSource === "dummyjson" && tech.apiId) {
        const res = await fetch(`${DUMMY_PRODUCTS_URL}/${tech.apiId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        product = await res.json();
      } else {
        const res = await fetch(
          `${DUMMY_SEARCH_URL}${encodeURIComponent(tech.title)}&limit=1`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        product =
          Array.isArray(data?.products) && data.products[0]
            ? data.products[0]
            : null;
      }

      const resources = Array.isArray(product?.images) ? product.images : [];
      const merged = Array.from(
        new Set([...(tech.resources || []), ...resources])
      );

      await updateTechnology(techId, {
        resources: merged,
        apiSource: "dummyjson",
        apiId: product?.id ?? tech.apiId,
      });
    } catch (e) {
      console.error(e);
      throw new Error("Не удалось загрузить дополнительные ресурсы");
    }
  };

  const searchByQueryGitHub = async (query, signal) => {
    const q = String(query || "").trim();
    if (!q) return [];

    const url =
      "https://api.github.com/search/repositories" +
      `?q=${encodeURIComponent(
        q
      )}+in:name,description&sort=stars&order=desc&per_page=10`;

    const headers = { Accept: "application/vnd.github+json" };

    const token = import.meta.env?.VITE_GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(url, { signal, headers });
    if (!res.ok) {
      let extra = "";
      try {
        const data = await res.json();
        if (data?.message) extra = ` (${data.message})`;
      } catch {}
      throw new Error(`Ошибка GitHub API: ${res.status}${extra}`);
    }

    const data = await res.json();
    const items = Array.isArray(data?.items) ? data.items : [];

    return items.map((repo) => ({
      apiSource: "github",
      apiId: repo.id,
      title: repo.name,
      description: repo.description || "Нет описания",
      category: "github",
      resources: [repo.html_url],
    }));
  };

  const removeDummyImported = () => {
    setTechnologies((prev) =>
      (prev || []).filter((t) => t.apiSource !== "dummyjson")
    );
  };
  return {
    technologies,
    setTechnologies,
    loading,
    error,
    progress,
    refetch,
    addTechnology,
    updateTechnology,
    deleteTechnology,
    loadAdditionalResources,
    searchByQueryGitHub,
    removeDummyImported,
  };
}
