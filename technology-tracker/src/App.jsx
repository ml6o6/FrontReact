import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import useTechnologies from "./hooks/useTechnologies";

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
  const {
    technologies,
    updateStatus,
    updateNotes,
    addTechnology,
    markAllCompleted,
    resetAllStatuses,
    clearAllNotes,
    resetToInitial,
    progress,
  } = useTechnologies();

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

  return (
    <div className="app">
      <Navigation
        isLoggedIn={isLoggedIn}
        username={username}
        onLogout={handleLogout}
      />

      <Routes>
        <Route path="/" element={<Home technologies={technologies} isLoggedIn={isLoggedIn} />} />

        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
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
                onStatusChange={updateStatus}
                onNotesChange={updateNotes}
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
