import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { RoleProvider } from "./roles";
import "./styles.css";
import "./designs.css";
import "./quad.css";
import "./workspace.css";
import "./refine.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RoleProvider>
      <App />
    </RoleProvider>
  </StrictMode>
);
