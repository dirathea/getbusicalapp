import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"

// Check for Web Crypto API support before rendering
if (!window.crypto || !window.crypto.subtle) {
  document.body.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      font-family: system-ui, -apple-system, sans-serif;
      padding: 20px;
      text-align: center;
    ">
      <div style="max-width: 500px;">
        <h1 style="font-size: 24px; margin-bottom: 16px; color: #dc2626;">
          Browser Not Supported
        </h1>
        <p style="color: #6b7280; margin-bottom: 20px;">
          BusiCal requires modern encryption features that are not available in your browser.
        </p>
        <p style="color: #6b7280; font-size: 14px;">
          Please use a modern browser like <strong>Chrome</strong>, <strong>Firefox</strong>, 
          <strong>Safari</strong>, or <strong>Edge</strong>.
        </p>
      </div>
    </div>
  `;
  throw new Error('Web Crypto API not supported');
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
