/**
 * Hook useAuth
 * Fornece contexto de autenticação para componentes
 * Simples e direto - sem Context necessário para MVP
 */

import { useEffect, useState, useRef } from 'react';
import { firebaseAuthService } from '@/services/firebase/auth';
import { AuthUser, AuthError } from '@/services/api/auth';

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  error: AuthError | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  isAdmin: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const [firstAuthCheckDone, setFirstAuthCheckDone] = useState(false);
  const logoutTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Listener para mudanças de auth
  useEffect(() => {
    console.log('🔍 [DEBUG] Hook useAuth montado. Loading inicial:', loading);
    let isMounted = true;
    
    const unsubscribe = firebaseAuthService.onAuthStateChanged((authUser) => {
      console.log('🔍 [DEBUG] useAuth recebeu novo estado de usuário:', authUser?.email || 'null');
      console.log('🔍 [DEBUG] isMounted:', isMounted);
      
      if (isMounted) {
        setUser(authUser);
        setError(null);
        // Marca que a primeira checagem do Firebase foi completa
        setFirstAuthCheckDone(true);
        setLoading(false);
        console.log('✅ [DEBUG] Estado do hook atualizado. Loading agora = false');
      } else {
        console.log('⚠️ [DEBUG] Componente foi desmontado, ignorando atualização');
      }
    });

    return () => {
      console.log('🔍 [DEBUG] useAuth limpando (cleanup). Desinscrever do listener.');
      isMounted = false;
      unsubscribe();
      
      // Limpar timeout pendente de logout
      if (logoutTimeoutRef.current) {
        console.log('🧹 [DEBUG] Limpando timeout pendente de logout.');
        clearTimeout(logoutTimeoutRef.current);
        logoutTimeoutRef.current = null;
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      await firebaseAuthService.login(email, password);
      // User está atualizado pelo listener
    } catch (err) {
      const authError = err instanceof AuthError ? err : new AuthError('unknown', String(err));
      setError(authError);
      throw authError;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      setLoading(true);
      await firebaseAuthService.logout();
      setUser(null);
    } catch (err) {
      const authError = err instanceof AuthError ? err : new AuthError('unknown', String(err));
      setError(authError);
      throw authError;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await firebaseAuthService.resetPassword(email);
    } catch (err) {
      const authError = err instanceof AuthError ? err : new AuthError('unknown', String(err));
      setError(authError);
      throw authError;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setError(null);
      setLoading(true);
      await firebaseAuthService.changePassword(currentPassword, newPassword);
      
      // Se chegou aqui, a senha foi alterada com sucesso
      // Fazer logout automático após 3 segundos
      console.log('⏱️ [DEBUG] Agendando logout automático em 3 segundos...');
      logoutTimeoutRef.current = setTimeout(() => {
        console.log('⏰ [DEBUG] Timeout de logout disparado. Executando logout...');
        firebaseAuthService.logout().then(() => {
          setUser(null);
          setLoading(false);
          // Redirecionar para login (será feito por quem chama changePassword)
        });
        logoutTimeoutRef.current = null;
      }, 3000);
    } catch (err) {
      const authError = err instanceof AuthError ? err : new AuthError('unknown', String(err));
      setError(authError);
      setLoading(false);
      throw authError;
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    resetPassword,
    changePassword,
    isAdmin: user?.role === 'admin',
  };
};
