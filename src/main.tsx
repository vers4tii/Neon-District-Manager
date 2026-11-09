import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {
  applyDisplaySettings,
  loadDisplaySettings,
} from './utils/displaySettings'

// Apply the saved display settings before the first paint
applyDisplaySettings(loadDisplaySettings())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
