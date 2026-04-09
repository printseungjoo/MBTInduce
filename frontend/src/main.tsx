import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { ThemeProvider } from '@emotion/react'
import { theme } from './styles/theme'
import { GlobalStyle } from './styles/GlobalStyle'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={ theme }>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
