import { useState, useEffect } from "react";

const TECH_API_URL = "https://api.github.com/search/repositories?q=topic:";

function useTechnologiesApi() {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchTechnologies = async (
    techNames = ["react", "node", "python", "javascript"]
  ) => {
    try {
      setLoading(true);
      setError(null);

      const technologiesData = [];

      for (const techName of techNames) {
        try {
          const response = await fetch(
            `${TECH_API_URL}${techName}&sort=stars&per_page=1`
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          if (data.items && data.items.length > 0) {
            const repo = data.items[0];
            technologiesData.push({
              id: repo.id,
              title: techName.charAt(0).toUpperCase() + techName.slice(1),
              description:
                repo.description || `Информация о технологии ${techName}`,
              category: getCategoryByTech(techName),
              status: "not-started",
              progress: 0,
              notes: "",
              githubUrl: repo.html_url,
              stars: repo.stargazers_count,
              language: repo.language,
            });
          }
        } catch (err) {
          console.warn(`Не удалось загрузить данные для ${techName}:`, err);
        }
      }

      if (technologiesData.length === 0) {
        setTechnologies(getMockTechnologies());
      } else {
        setTechnologies(technologiesData);
      }
    } catch (err) {
      setError("Не удалось загрузить технологии из API");
      console.error("Ошибка загрузки:", err);
      setTechnologies(getMockTechnologies());
    } finally {
      setLoading(false);
    }
  };

  const getCategoryByTech = (techName) => {
    const categories = {
      react: "frontend",
      vue: "frontend",
      angular: "frontend",
      javascript: "frontend",
      typescript: "frontend",
      node: "backend",
      python: "backend",
      java: "backend",
      go: "backend",
      mysql: "database",
      mongodb: "database",
      postgresql: "database",
      docker: "devops",
      kubernetes: "devops",
      aws: "devops",
    };

    return categories[techName] || "other";
  };

  const getMockTechnologies = () => [
    {
      id: 1,
      title: "React",
      description: "Библиотека для создания пользовательских интерфейсов",
      category: "frontend",
      status: "not-started",
      progress: 0,
      notes: "",
      githubUrl: "https://github.com/facebook/react",
      stars: 217000,
      language: "JavaScript",
    },
    {
      id: 2,
      title: "Node.js",
      description: "Среда выполнения JavaScript на сервере",
      category: "backend",
      status: "not-started",
      progress: 0,
      notes: "",
      githubUrl: "https://github.com/nodejs/node",
      stars: 101000,
      language: "JavaScript",
    },
    {
      id: 3,
      title: "TypeScript",
      description: "Типизированное надмножество JavaScript",
      category: "language",
      status: "not-started",
      progress: 0,
      notes: "",
      githubUrl: "https://github.com/microsoft/TypeScript",
      stars: 95000,
      language: "TypeScript",
    },
    {
      id: 4,
      title: "Python",
      description: "Высокоуровневый язык программирования",
      category: "backend",
      status: "not-started",
      progress: 0,
      notes: "",
      githubUrl: "https://github.com/python/cpython",
      stars: 59000,
      language: "Python",
    },
    {
      id: 5,
      title: "MongoDB",
      description: "Документоориентированная система управления базами данных",
      category: "database",
      status: "not-started",
      progress: 0,
      notes: "",
      githubUrl: "https://github.com/mongodb/mongo",
      stars: 25000,
      language: "C++",
    },
  ];

  const addTechnology = async (techData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newTech = {
        id: Date.now(),
        ...techData,
        createdAt: new Date().toISOString(),
        progress:
          techData.status === "completed"
            ? 100
            : techData.status === "in-progress"
            ? 50
            : 0,
      };

      setTechnologies((prev) => [...prev, newTech]);
      return newTech;
    } catch (err) {
      throw new Error("Не удалось добавить технологию");
    }
  };

  const updateTechnology = async (techId, updates) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      setTechnologies((prev) =>
        prev.map((tech) =>
          tech.id === techId
            ? {
                ...tech,
                ...updates,
                progress:
                  updates.status === "completed"
                    ? 100
                    : updates.status === "in-progress"
                    ? 50
                    : updates.progress !== undefined
                    ? updates.progress
                    : tech.progress,
              }
            : tech
        )
      );
    } catch (err) {
      throw new Error("Не удалось обновить технологию");
    }
  };

  const deleteTechnology = async (techId) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setTechnologies((prev) => prev.filter((tech) => tech.id !== techId));
    } catch (err) {
      throw new Error("Не удалось удалить технологию");
    }
  };

  useEffect(() => {
    searchTechnologies();
  }, []);

  return {
    technologies,
    loading,
    error,
    refetch: searchTechnologies,
    addTechnology,
    updateTechnology,
    deleteTechnology,
    searchTechnologies,
    setTechnologies,
  };
}

export default useTechnologiesApi;
