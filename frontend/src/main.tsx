import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import { store } from "./redux/store";

import "./index.css";


ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>

    <Provider store={store}>

      <BrowserRouter>

        <App />

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "12px",
              background: "#1e293b",
              color: "#fff",
              fontSize: "14px",
            },
          }}
        />

      </BrowserRouter>

    </Provider>

  </React.StrictMode>
);