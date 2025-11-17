
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'clsx'; // Importing for potential side-effects or build inclusion, though not strictly needed at runtime with CDN.

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
