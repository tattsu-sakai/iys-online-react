import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as JotaiProvider } from 'jotai';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

declare global {
  interface Window {
    otpInput?: (element: HTMLElement) => void;
  }
}

function renderApp(element: HTMLElement) {
  ReactDOM.createRoot(element).render(
    <React.StrictMode>
      <JotaiProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </JotaiProvider>
    </React.StrictMode>
  );
}

window.otpInput = (element: HTMLElement) => {
  renderApp(element);
};

const rootElement = document.getElementById('root');
if (rootElement) {
  renderApp(rootElement);
}
