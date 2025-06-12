import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

let navigateFunction = null;

export const globalNavigate = (path) => {
  if (navigateFunction) {
    navigateFunction(path);
  }
  else {
    console.warn("globalNavigate: useNavigate function not yet available. Falling back to windows.location.");
    window.location.href = path;
  }
}

export const setGlobalNavigateFunction = (navigate) => {
  navigateFunction = navigate;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
