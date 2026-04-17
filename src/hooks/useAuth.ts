/**
 * Hook useAuth
 * Fornece contexto de autenticação para componentes
 * Simples e direto - sem Context necessário para MVP
 */

import { useEffect, useState } from 'react';
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

  // Listener para mudanças de auth
  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = firebaseAuthService.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
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
      setTimeout(() => {
        firebaseAuthService.logout().then(() => {
          setUser(null);
          setLoading(false);
          // Redirecionar para login (será feito por quem chama changePassword)
        });
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
