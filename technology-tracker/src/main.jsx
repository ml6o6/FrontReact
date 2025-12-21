import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { UiProvider } from "./theme/UiContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <UiProvider>
        <App />
      </UiProvider>
    </BrowserRouter>
  </StrictMode>
);
