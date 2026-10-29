import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Link and register public/sw.js for background push notifications
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/simon/sw.js', { scope: '/simon/' })
      .then((reg) => {
        console.log('Webstudios Service Worker registered with scope:', reg.scope);
      })
      .catch((err) => {
        console.warn('Service Worker registration notice:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
