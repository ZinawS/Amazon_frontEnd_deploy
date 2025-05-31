import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import DataProvider from "./DataProvider/DataProvider.jsx";
import { reducer, initialState } from "./Utility/reducer.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <DataProvider initialState={initialState} reducer={reducer}>
        <App />
      </DataProvider>
    </BrowserRouter>
  </React.StrictMode>
);
