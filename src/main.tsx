import { RouterProvider } from 'react-router-dom'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './App'
import { AuthProvider } from '@/contexts/AuthContext'

// 🔥 Inicializar Firebase (DEVE ser importado antes de usar)
import '@/services/firebase/config'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
