import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
      <TonConnectUIProvider manifestUrl="https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json">
          <App />
      </TonConnectUIProvider>
  </React.StrictMode>,
);
