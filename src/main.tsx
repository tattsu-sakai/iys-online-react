import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

if (import.meta.env.DEV) {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} else {
  window.otpInput = (element) => {
    ReactDOM.createRoot(element).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  };
}
