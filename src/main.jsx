import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { DarkModeProvider } from "./context/DarkModeContext";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <DarkModeProvider>
        <App />
      </DarkModeProvider>
    </React.StrictMode>
  );
}
