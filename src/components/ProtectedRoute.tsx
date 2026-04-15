import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Componente para proteger rotas que exigem autenticação
 * Redireciona para /admin se não estiver autenticado
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Aguarda Firebase verificar autenticação
    if (!loading) {
      setIsInitialized(true);
    }
  }, [loading]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
          <p>Carregando Painel...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para login
  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  // Se estiver autenticado, renderiza o conteúdo
  return <>{children}</>;
};

export default ProtectedRoute;
