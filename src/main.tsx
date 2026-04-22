import { RouterProvider } from 'react-router-dom'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './App'
import { AuthProvider } from '@/contexts/AuthContext'
import { PortalSettingsProvider } from '@/contexts/PortalSettingsContext'

// 🔥 Inicializar Firebase (DEVE ser importado antes de usar)
import '@/services/firebase/config'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <PortalSettingsProvider>
        <RouterProvider router={router} />
      </PortalSettingsProvider>
    </AuthProvider>
  </StrictMode>,
)
