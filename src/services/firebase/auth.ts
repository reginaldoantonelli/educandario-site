/**
 * Implementação Firebase para Autenticação
 * Implementa a interface AuthService do firebase
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  type User,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from './config';
import { AuthService, AuthUser, AuthError } from '@/services/api/auth';

/**
 * Implementação Firebase do serviço de autenticação
 */
export class FirebaseAuthService implements AuthService {
  /**
   * Converter Firebase User para AuthUser
   */
  private async firebaseUserToAuthUser(firebaseUser: User): Promise<AuthUser> {
    console.log('🔄 [DEBUG] Convertendo Firebase User para AuthUser:', firebaseUser.email);
    
    // Já temos o token de admin no claims
    const idTokenResult = await firebaseUser.getIdTokenResult();
    console.log('📋 [DEBUG] Token obtido. Verificando claims de admin...');
    console.log('👤 [DEBUG] Custom claims:', idTokenResult.claims);
    
    const isAdmin = idTokenResult.claims.admin === true;
    console.log('🔐 [DEBUG] isAdmin:', isAdmin);

    const authUser = {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      name: firebaseUser.displayName || undefined,
      role: isAdmin ? 'admin' : 'user',
      createdAt: firebaseUser.metadata.creationTime
        ? new Date(firebaseUser.metadata.creationTime)
        : new Date(),
    };
    
    console.log('✅ [DEBUG] AuthUser criado:', authUser);
    return {
      ...authUser,
      role: (authUser.role as 'admin' | 'user') || 'user',
    };
  }

  /**
   * Login com email e senha
   */
  async login(email: string, password: string): Promise<AuthUser> {
    try {
      console.log('🔑 [DEBUG] Tentando login com email:', email);
      // Persistência já foi configurada globalmente no carregamento do módulo
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ [DEBUG] Login bem-sucedido para:', userCredential.user.email);
      console.log('📝 [DEBUG] Usuário UID:', userCredential.user.uid);
      console.log('⏱️ [DEBUG] Sessão será salva automaticamente pelo Firebase com persistência configurada');
      const authUser = await this.firebaseUserToAuthUser(userCredential.user);
      console.log('✅ [DEBUG] AuthUser criado:', { email: authUser.email, role: authUser.role });
      return authUser;
    } catch (error: any) {
      console.error('❌ [DEBUG] Erro no login:', error.code, error.message);
      // Traduzir erros Firebase
      const errorMap: Record<string, string> = {
        'auth/user-not-found': 'Usuário não encontrado',
        'auth/wrong-password': 'Senha incorreta',
        'auth/invalid-email': 'Email inválido',
        'auth/user-disabled': 'Usuário desabilitado',
      };

      const message =
        errorMap[error.code] || error.message || 'Erro ao fazer login';
      throw new AuthError(error.code, message, error);
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      console.log('🚪 [DEBUG] Executando logout...');
      await signOut(auth);
      console.log('✅ [DEBUG] Logout bem-sucedido. Sessão foi limpa do Firebase');
    } catch (error: any) {
      console.error('❌ [DEBUG] Erro ao fazer logout:', error);
      throw new AuthError(error.code, 'Erro ao fazer logout', error);
    }
  }

  /**
   * Criar novo usuário admin (apenas para admins)
   */
  async createAdminUser(
    email: string,
    password: string,
    name: string
  ): Promise<AuthUser> {
    try {
      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Atualizar perfil
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      // Salvar dados no Firestore com role admin
      await setDoc(doc(firestore, 'users', userCredential.user.uid), {
        email,
        name,
        role: 'admin',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Retornar usuário criado
      return this.firebaseUserToAuthUser(userCredential.user);
    } catch (error: any) {
      const errorMap: Record<string, string> = {
        'auth/email-already-in-use': 'Email já está em uso',
        'auth/weak-password': 'Senha muito fraca',
        'auth/invalid-email': 'Email inválido',
      };

      const message =
        errorMap[error.code] || error.message || 'Erro ao criar usuário';
      throw new AuthError(error.code, message, error);
    }
  }

  /**
   * Obter usuário autenticado atualmente
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;

    return this.firebaseUserToAuthUser(firebaseUser);
  }

  /**
   * Verificar se está autenticado
   */
  async isAuthenticated(): Promise<boolean> {
    return auth.currentUser != null;
  }

  /**
   * Enviar email para resetar senha
   */
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      const message =
        error.code === 'auth/user-not-found'
          ? 'Email não encontrado'
          : 'Erro ao enviar email de reset';
      throw new AuthError(error.code, message, error);
    }
  }

  /**
   * Atualizar perfil do usuário
   */
  async updateProfile(updates: Partial<AuthUser>): Promise<void> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      throw new AuthError('auth/not-authenticated', 'Usuário não autenticado');
    }

    try {
      // Atualizar em Firebase Auth (nome)
      if (updates.name) {
        await updateProfile(firebaseUser, { displayName: updates.name });
      }

      // Atualizar em Firestore
      await setDoc(
        doc(firestore, 'users', firebaseUser.uid),
        {
          ...updates,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error: any) {
      throw new AuthError(error.code, 'Erro ao atualizar perfil', error);
    }
  }

  /**
   * Alterar senha do usuário autenticado
   * Requer autenticação prévia com a senha atual
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser || !firebaseUser.email) {
      console.error('❌ [DEBUG] Usuário não autenticado para alterar senha');
      throw new AuthError('auth/not-authenticated', 'Usuário não autenticado');
    }

    try {
      console.log('🔐 [DEBUG] Iniciando alteração de senha para:', firebaseUser.email);
      // Reauthenticar com a senha atual
      const credential = EmailAuthProvider.credential(
        firebaseUser.email,
        currentPassword
      );
      console.log('🔑 [DEBUG] Criado credencial para reauthenticação');
      
      await reauthenticateWithCredential(firebaseUser, credential);
      console.log('✅ [DEBUG] Reauthenticação bem-sucedida');

      // Atualizar para nova senha
      await updatePassword(firebaseUser, newPassword);
      console.log('✅ [DEBUG] Senha alterada com sucesso no Firebase!');
      console.log('⏱️ [DEBUG] Logout será disparado em 3 segundos...');
    } catch (error: any) {
      console.error('❌ [DEBUG] Erro ao alterar senha:', error.code, error.message);
      const errorMap: Record<string, string> = {
        'auth/wrong-password': 'Senha atual incorreta',
        'auth/weak-password': 'Nova senha muito fraca',
        'auth/requires-recent-login': 'Faça login novamente por segurança',
      };

      const message = errorMap[error.code] || error.message || 'Erro ao alterar senha';
      throw new AuthError(error.code, message, error);
    }
  }

  /**
   * Listener para mudanças de autenticação
   * Retorna função para desinscrever
   */
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    console.log('🔍 [DEBUG] Listener onAuthStateChanged assinado.');
    console.log('⏳ [DEBUG] Aguardando Firebase verificar sessão armazenada...');

    return onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔍 [DEBUG] Firebase retornou usuário:', firebaseUser ? `${firebaseUser.email}` : 'null');
      console.log('🔍 [DEBUG] Timestamp:', new Date().toISOString());
      
      if (firebaseUser) {
        try {
          const authUser = await this.firebaseUserToAuthUser(firebaseUser);
          console.log('✅ [DEBUG] Conversão para AuthUser concluída:', { email: authUser.email, role: authUser.role });
          callback(authUser);
        } catch (e) {
          console.error('❌ [DEBUG] Erro na conversão de usuário:', e);
          callback(null);
        }
      } else {
        console.log('⚠️ [DEBUG] Nenhum usuário encontrado. Possíveis causas:');
        console.log('   1. Usuário não fez login ainda');
        console.log('   2. Sessão expirou');
        console.log('   3. IndexedDB está vazio/corrompido');
        callback(null);
      }
    });
  }
}

// Instância singleton
export const firebaseAuthService = new FirebaseAuthService();
