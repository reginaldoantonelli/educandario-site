/**
 * Interface de Autenticação (Agnostic)
 * Não depende de Firebase ou Supabase
 * Permite trocar de provider depois sem quebrar componentes
 */

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface AuthService {
  // Login
  login(email: string, password: string): Promise<AuthUser>;
  
  // Logout
  logout(): Promise<void>;
  
  // Criar admin (apenas admins)
  createAdminUser(email: string, password: string, name: string): Promise<AuthUser>;
  
  // Obter usuário atual
  getCurrentUser(): Promise<AuthUser | null>;
  
  // Verificar se está autenticado
  isAuthenticated(): Promise<boolean>;
  
  // Reset de senha
  resetPassword(email: string): Promise<void>;
  
  // Alterar senha do usuário autenticado
  changePassword(currentPassword: string, newPassword: string): Promise<void>;
  
  // Atualizar perfil
  updateProfile(updates: Partial<AuthUser>): Promise<void>;
  
  // Listener para mudanças de auth
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void;
}

export class AuthError extends Error {
  constructor(
    public code: string,
    message: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
