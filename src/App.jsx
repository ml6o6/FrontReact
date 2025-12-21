import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { useUi } from "./theme/UiContext.jsx";

import useTechnologiesApi from "./hooks/useTechnologiesApi.js";

import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import TechnologyList from "./pages/TechnologyList";
import TechnologyDetail from "./pages/TechnologyDetail";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import AddTechnology from "./pages/AddTechnology";
import NotFound from "./pages/NotFound";

export default function App() {
  const { notify } = useUi();
  const {
    technologies,
    loading,
    error,
    refetch,
    searchByQueryGitHub,
    loadAdditionalResources,
    addTechnology,
    updateTechnology,
    deleteTechnology,
    setTechnologies,
  } = useTechnologiesApi();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = localStorage.getItem("username") || "";
    setIsLoggedIn(loggedIn);
    setUsername(user);
  }, []);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUsername(user || "");
    notify(`Добро пожаловать, ${user || "user"}!`, "success");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");
    notify("Вы вышли из аккаунта", "info");
  };

  const onStatusChange = async (techId, value) => {
    let updates = {};

    if (typeof value === "boolean") {
      updates.status = value ? "completed" : "not-started";
      updates.progress = value ? 100 : 0;
    } else if (typeof value === "number") {
      updates.progress = value;
      updates.status =
        value >= 100 ? "completed" : value > 0 ? "in-progress" : "not-started";
    } else if (typeof value === "string") {
      updates.status = value;
      updates.progress =
        value === "completed" ? 100 : value === "in-progress" ? 50 : 0;
    }

    try {
      await updateTechnology(techId, updates);
    } catch (e) {
      console.error(e);
      notify("Не удалось обновить статус технологии", "error");
    }
  };

  const onNotesChange = async (techId, notes) => {
    try {
      await updateTechnology(techId, { notes });
    } catch (e) {
      console.error(e);
      notify("Не удалось сохранить заметки", "error");
    }
  };

  const markAllCompleted = () => {
    setTechnologies((prev) =>
      prev.map((t) => ({
        ...t,
        status: "completed",
        progress: 100,
      }))
    );
  };

  const resetAllStatuses = () => {
    setTechnologies((prev) =>
      prev.map((t) => ({
        ...t,
        status: "not-started",
        progress: 0,
      }))
    );
  };

  const clearAllNotes = () => {
    setTechnologies((prev) => prev.map((t) => ({ ...t, notes: "" })));
  };

  const resetToInitial = () => {
    refetch();
  };

  // прогресс
  const total = technologies.length;
  const completed = technologies.filter(
    (t) => t?.status === "completed" || (t?.progress ?? 0) >= 100
  ).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  const bulkUpdate = async (updates) => {
    const nextUpdates = {};
    if (updates?.status) {
      nextUpdates.status = updates.status;
      nextUpdates.progress =
        updates.status === "completed"
          ? 100
          : updates.status === "in-progress"
          ? 50
          : 0;
    }
    if (typeof updates?.deadline === "string") {
      nextUpdates.deadline = updates.deadline;
    }

    try {
      const list = Array.isArray(technologies) ? technologies : [];
      for (const t of list) {
        await updateTechnology(t.id, nextUpdates);
      }
    } catch (e) {
      console.error(e);
      notify("Ошибка массового обновления", "error");
    }
  };

  const handleImportTechnologies = (importedTechnologies) => {
    notify("Импорт выполнен", "success");
    const incoming = Array.isArray(importedTechnologies)
      ? importedTechnologies
      : [];
    setTechnologies((prev) => {
      const existing = Array.isArray(prev) ? prev : [];
      const existingIds = new Set(existing.map((t) => t.id));
      const normalized = incoming.map((t) => {
        const rawId = t?.id;
        const id =
          rawId && !existingIds.has(rawId)
            ? rawId
            : Date.now() + Math.floor(Math.random() * 100000);
        return {
          id,
          title: String(t?.title ?? "").trim() || "Без названия",
          description: String(t?.description ?? "").trim(),
          category: String(t?.category ?? "other").trim() || "other",
          status: t?.status ?? "not-started",
          notes: t?.notes ?? "",
          resources: Array.isArray(t?.resources) ? t.resources : [],
          difficulty: t?.difficulty ?? "beginner",
          deadline: t?.deadline ?? "",
          createdAt: t?.createdAt ?? new Date().toISOString(),
        };
      });
      const fingerprint = new Set(
        existing.map((t) => `${t.title}__${t.description}`)
      );
      const toAdd = normalized.filter(
        (t) => !fingerprint.has(`${t.title}__${t.description}`)
      );
      return [...existing, ...toAdd];
    });
  };

  return (
    <div className="app">
      <Navigation
        isLoggedIn={isLoggedIn}
        username={username}
        onLogout={handleLogout}
      />

      <Routes>
        <Route
          path="/"
          element={<Home technologies={technologies} isLoggedIn={isLoggedIn} />}
        />

        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        <Route
          path="/technologies"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <TechnologyList
                technologies={technologies}
                progress={progress}
                onMarkAllCompleted={markAllCompleted}
                onResetAll={resetAllStatuses}
                onImportAdd={addTechnology}
                onSearch={searchByQueryGitHub}
                loading={loading}
                error={error}
                onRetry={refetch}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/technology/:techId"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <TechnologyDetail
                technologies={technologies}
                onStatusChange={onStatusChange}
                onNotesChange={onNotesChange}
                onDelete={deleteTechnology}
                onLoadResources={loadAdditionalResources}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/statistics"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Statistics technologies={technologies} progress={progress} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              {" "}
              <Settings
                isLoggedIn={isLoggedIn}
                username={username}
                onLogout={handleLogout}
                onMarkAllCompleted={markAllCompleted}
                onResetAll={resetAllStatuses}
                onClearAllNotes={clearAllNotes}
                onResetData={resetToInitial}
                technologies={technologies}
                onImportTechnologies={handleImportTechnologies}
                onBulkUpdate={bulkUpdate}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-technology"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <AddTechnology onAdd={addTechnology} />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
