import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AppProvider } from "./context/appContext";
import { Alert, LoadingOver } from "./components";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppProvider>
      <LoadingOver />
      <Alert />
      <App />
    </AppProvider>
  </React.StrictMode>
);
