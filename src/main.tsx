import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as JotaiProvider } from 'jotai';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

if (import.meta.env.DEV) {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <JotaiProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </JotaiProvider>
    </React.StrictMode>,
  );
} else {
  window.otpInput = (element) => {
    ReactDOM.createRoot(element).render(
      <React.StrictMode>
        <JotaiProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </JotaiProvider>
      </React.StrictMode>,
    );
  };
}
