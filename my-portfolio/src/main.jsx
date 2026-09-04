import { HelmetProvider } from "react-helmet-async";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "aos/dist/aos.css";
import App from './App.jsx'
import AOS from "aos";

AOS.init({
  once: true,
  offset: 100
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/serviceWorker.js")
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
