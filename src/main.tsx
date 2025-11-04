import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const baseUrl = import.meta.env.BASE_URL;
const redirectKey = 'gh-pages-redirect';

const redirectPath = sessionStorage.getItem(redirectKey);
if (redirectPath) {
    sessionStorage.removeItem(redirectKey);
    const targetUrl = new URL(redirectPath, window.location.origin);
    window.history.replaceState(null, '', targetUrl);
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        const serviceWorkerPath = `${baseUrl}sw.js`;
        navigator.serviceWorker.register(serviceWorkerPath).catch(() => {
            // ignore registration errors
        });
    });
}
