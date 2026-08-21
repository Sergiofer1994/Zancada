import "./instrument.js";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from "@sentry/react";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<p>Algo salió mal. Recarga la página.</p>}>
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>,
)