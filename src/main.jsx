import "./instrument.js";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from "@sentry/react";
import './index.css'
import App from './App.jsx'

function SentryTestButton() {
  return (
    <button
      onClick={() => {
        throw new Error("Error de prueba del frontend para Sentry");
      }}
      style={{
        position: "fixed",
        top: "10px",
        left: "10px",
        zIndex: 9999,
        padding: "10px 16px",
        background: "#7b2ff7",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
      }}
    >
      Probar Sentry
    </button>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<p>Algo salió mal. Recarga la página.</p>}>
      <SentryTestButton />
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>,
)