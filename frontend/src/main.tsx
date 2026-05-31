import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { ThemeProvider } from '@emotion/react'
import { theme } from './styles/theme'
import { GlobalStyle } from './styles/GlobalStyle'
import { BrowserRouter } from 'react-router-dom'

declare global {
  interface Window {
    dataLayer: unknown[][];
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
