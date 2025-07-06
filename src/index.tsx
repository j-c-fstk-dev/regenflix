import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Se você tiver um arquivo CSS global
import App from './App';
import './i18n'; // Importe a configuração do i18n

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement); // Tipar o elemento
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);