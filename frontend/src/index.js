import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import TonConnectConfig from "./tonconnect-config";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
      <TonConnectConfig>
          <App />
      </TonConnectConfig>
  </React.StrictMode>,
);
