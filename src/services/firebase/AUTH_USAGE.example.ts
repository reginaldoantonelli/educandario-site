/**
 * Guia de Uso - Serviços de Autenticação Firebase
 */

// ✅ Exemplo 1: Usar em componentes
/*
import { useAuth } from '@/hooks/useAuth';

export const MyComponent = () => {
  const { user, loading, error, login, logout, isAdmin } = useAuth();

  const handleLogin = async () => {
    try {
      await login('admin@educandario.com', 'senha123');
    } catch (err) {
      console.error('Erro ao fazer login:', err);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      {user ? (
        <>
          <p>Bem-vindo, {user.name}!</p>
          <p>Role: {user.role}</p>
          {isAdmin && <button>Admin Dashboard</button>}
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <p>Não autenticado</p>
          <button onClick={handleLogin}>Login</button>
        </>
      )}
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
    </div>
  );
};
*/

// ✅ Exemplo 2: Proteger rotas
/*
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <div>Carregando...</div>;
  if (!isAdmin) return <Navigate to="/login" />;

  return <>{children}</>;
};
*/

// ✅ Exemplo 3: Usar Auth Service diretamente (avançado)
/*
import { firebaseAuthService } from '@/services/firebase/auth';

// Login
const user = await firebaseAuthService.login('email@example.com', 'senha123');

// Reset de senha
await firebaseAuthService.resetPassword('email@example.com');

// Logout
await firebaseAuthService.logout();

// Obter usuário atual
const currentUser = await firebaseAuthService.getCurrentUser();
*/

export default {}; // Dummy export
