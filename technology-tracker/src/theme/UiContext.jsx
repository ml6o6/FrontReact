import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import useMediaQuery from "@mui/material/useMediaQuery";

const UiContext = createContext(null);

export function UiProvider({ children }) {
  const prefersSmall = useMediaQuery("(max-width:600px)");

  const [themeMode, setThemeMode] = useState(() => {
    const saved = localStorage.getItem("themeMode");
    return saved === "light" || saved === "dark" ? saved : "dark";
  });

  useEffect(() => {
    localStorage.setItem("themeMode", themeMode);
  }, [themeMode]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: themeMode,
        primary: { main: "#1976d2" },
        secondary: { main: "#dc004e" },
      },
      shape: { borderRadius: 12 },
    });
  }, [themeMode]);

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "info",
    autoHideDuration: 4000,
  });

  const notify = (message, severity = "info", autoHideDuration = 4000) => {
    setSnack({
      open: true,
      message: String(message || ""),
      severity,
      autoHideDuration,
    });
  };

  const closeSnack = (_, reason) => {
    if (reason === "clickaway") return;
    setSnack((s) => ({ ...s, open: false }));
  };

  const anchorOrigin = prefersSmall
    ? { vertical: "bottom", horizontal: "center" }
    : { vertical: "top", horizontal: "right" };

  const value = useMemo(
    () => ({ themeMode, toggleTheme, notify }),
    [themeMode]
  );

  return (
    <UiContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}

        <Snackbar
          open={snack.open}
          autoHideDuration={snack.autoHideDuration}
          onClose={closeSnack}
          anchorOrigin={anchorOrigin}
        >
          <Alert
            onClose={closeSnack}
            severity={snack.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snack.message}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </UiContext.Provider>
  );
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) {
    throw new Error("useUi must be used within UiProvider");
  }
  return ctx;
}
