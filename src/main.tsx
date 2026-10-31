import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/instrument-serif/latin-400.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import '@fontsource/inter-tight/latin-400.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import App from './App.tsx';
import './index.css';
import { ToastProvider } from './context/ToastContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>
);
