import useLocalStorage from "./useLocalStorage";

const initialTechnologies = [
  {
    id: 1,
    title: "React Components",
    description: "Изучение базовых компонентов",
    status: "not-started",
    notes: "",
    category: "frontend",
  },
  {
    id: 2,
    title: "Node.js Basics",
    description: "Основы серверного JavaScript",
    status: "not-started",
    notes: "",
    category: "backend",
  },
  {
    id: 3,
    title: "Express Routing",
    description: "Маршрутизация и middleware в Express",
    status: "not-started",
    notes: "",
    category: "backend",
  },
  {
    id: 4,
    title: "REST API",
    description: "Проектирование API и работа с HTTP методами",
    status: "not-started",
    notes: "",
    category: "backend",
  },
  {
    id: 5,
    title: "SQL Basics",
    description: "Основы SQL и простые запросы",
    status: "not-started",
    notes: "",
    category: "database",
  },
  {
    id: 6,
    title: "React State",
    description: "useState, производные данные, ререндеры",
    status: "not-started",
    notes: "",
    category: "frontend",
  },
];

function calculateProgress(technologies) {
  if (!Array.isArray(technologies) || technologies.length === 0) return 0;
  const completed = technologies.filter((t) => t.status === "completed").length;
  return Math.round((completed / technologies.length) * 100);
}

function nextId(technologies) {
  const max = technologies.reduce((acc, t) => Math.max(acc, Number(t.id) || 0), 0);
  return max + 1;
}

export default function useTechnologies() {
  const [technologies, setTechnologies] = useLocalStorage(
    "technologies",
    initialTechnologies
  );

  // Обновление статуса технологии
  const updateStatus = (techId, newStatus) => {
    setTechnologies((prev) =>
      prev.map((tech) =>
        tech.id === techId ? { ...tech, status: newStatus } : tech
      )
    );
  };

  // Обновление заметок
  const updateNotes = (techId, newNotes) => {
    setTechnologies((prev) =>
      prev.map((tech) =>
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  };

  // Добавить технологию (для страницы AddTechnology)
  const addTechnology = ({ title, description, category }) => {
    const safeTitle = String(title || "").trim();
    const safeDescription = String(description || "").trim();
    const safeCategory = String(category || "other").trim() || "other";

    if (!safeTitle) return;

    setTechnologies((prev) => [
      ...prev,
      {
        id: nextId(prev),
        title: safeTitle,
        description: safeDescription,
        status: "not-started",
        notes: "",
        category: safeCategory,
      },
    ]);
  };

  // Массовые действия
  const markAllCompleted = () => {
    setTechnologies((prev) => prev.map((t) => ({ ...t, status: "completed" })));
  };

  const resetAllStatuses = () => {
    setTechnologies((prev) => prev.map((t) => ({ ...t, status: "not-started" })));
  };

  const clearAllNotes = () => {
    setTechnologies((prev) => prev.map((t) => ({ ...t, notes: "" })));
  };

  // Полный сброс данных к исходным (удобно для Настроек)
  const resetToInitial = () => {
    setTechnologies(initialTechnologies);
  };

  return {
    technologies,
    updateStatus,
    updateNotes,
    addTechnology,
    markAllCompleted,
    resetAllStatuses,
    clearAllNotes,
    resetToInitial,
    progress: calculateProgress(technologies),
  };
}
