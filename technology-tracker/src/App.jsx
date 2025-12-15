import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

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
  // Данные теперь из useTechnologiesApi (как у “другого человека”)
  const {
    technologies,
    loading,
    error,
    refetch,
    addTechnology,
    updateTechnology,
    deleteTechnology,
    setTechnologies,
  } = useTechnologiesApi();

  // --- auth ---
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
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");
  };

  // --- адаптеры под твои страницы (TechnologyDetail/Settings) ---
  const onStatusChange = async (techId, value) => {
    // value может быть boolean/number/string — приводим к status/progress
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
    }
  };

  const onNotesChange = async (techId, notes) => {
    try {
      await updateTechnology(techId, { notes });
    } catch (e) {
      console.error(e);
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
    // заново “подтянуть” технологии (как refetch в примере)
    refetch();
  };

  // --- прогресс (процент выполненных) ---
  const total = technologies.length;
  const completed = technologies.filter(
    (t) => t?.status === "completed" || (t?.progress ?? 0) >= 100
  ).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

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
              <Settings
                isLoggedIn={isLoggedIn}
                username={username}
                onLogout={handleLogout}
                onMarkAllCompleted={markAllCompleted}
                onResetAll={resetAllStatuses}
                onClearAllNotes={clearAllNotes}
                onResetData={resetToInitial}
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
