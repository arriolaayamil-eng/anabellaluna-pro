import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App';
import AppTest from './App.test';
import { ContextProvider } from './contexts/ContextProvider';

// Cambiar entre App y AppTest para debugging
const USE_TEST = false;

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {USE_TEST ? (
      <AppTest />
    ) : (
      <ContextProvider>
        <App />
      </ContextProvider>
    )}
  </React.StrictMode>,
);

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => console.log('SW registered:', reg.scope))
      .catch((err) => console.warn('SW registration failed:', err));
  });
}
