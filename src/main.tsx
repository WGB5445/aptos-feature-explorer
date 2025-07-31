import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n/index.ts'
import './i18n/test.ts'
import App from './App.tsx'

// Import feature bitmap utilities for development testing
if (import.meta.env.DEV) {
  import('./utils/featureBitmap');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
