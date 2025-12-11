import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import ScrollToTop from './components/ScrollToTop.tsx'
import { AuthProvider } from './context/AuthContext.tsx'

// Set the basename based on the environment
const basename = import.meta.env.MODE === 'production' ? '/static' : '/';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <ScrollToTop />
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
