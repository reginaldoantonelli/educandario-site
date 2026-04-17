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
  setPersistence,
  browserLocalPersistence,
  type User,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from './config';
import { AuthService, AuthUser, AuthError } from '@/services/api/auth';

/**
 * Configurar persistência GLOBALMENTE ao carregar o módulo
 * Isso garante que o Firebase SDK está pronto para ler do cache no F5
 */
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Erro ao configurar persistência Firebase:', error);
});

/**
 * Implementação Firebase do serviço de autenticação
 */
export class FirebaseAuthService implements AuthService {
  /**
   * Converter Firebase User para AuthUser
   */
  private async firebaseUserToAuthUser(firebaseUser: User): Promise<AuthUser> {
    // Já temos o token de admin no claims
    const idTokenResult = await firebaseUser.getIdTokenResult();
    const isAdmin = idTokenResult.claims.admin === true;

    return {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      name: firebaseUser.displayName || undefined,
      role: isAdmin ? 'admin' : 'user',
      createdAt: firebaseUser.metadata.creationTime
        ? new Date(firebaseUser.metadata.creationTime)
        : new Date(),
    };
  }

  /**
   * Login com email e senha
   */
  async login(email: string, password: string): Promise<AuthUser> {
    try {
      // Persistência já foi configurada globalmente no carregamento do módulo
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return this.firebaseUserToAuthUser(userCredential.user);
    } catch (error: any) {
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
      await signOut(auth);
    } catch (error: any) {
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
      throw new AuthError('auth/not-authenticated', 'Usuário não autenticado');
    }

    try {
      // Reauthenticar com a senha atual
      const credential = EmailAuthProvider.credential(
        firebaseUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(firebaseUser, credential);

      // Atualizar para nova senha
      await updatePassword(firebaseUser, newPassword);
    } catch (error: any) {
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
    return onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const authUser = await this.firebaseUserToAuthUser(firebaseUser);
          callback(authUser);
        } else {
          callback(null);
        }
      } catch (error) {
        // Se falhar na conversão, ainda assim avisa que não há usuário
        console.error('Erro ao converter usuário Firebase:', error);
        callback(null);
      }
    });
  }
}

// Instância singleton
export const firebaseAuthService = new FirebaseAuthService();
