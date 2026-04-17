/**
 * Serviço de Auditoria
 * 
 * Registra todas as ações do admin
 * Compartilhado entre Transparency e Settings
 * 
 * Firestore: audit_logs collection (persistente)
 * Fallback: localStorage (se Firestore falhar)
 */

import { collection, addDoc, query, orderBy, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/services/firebase/config';
import { userNotificationsService } from './userNotificationsService';

interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  timestamp: string;
  created_at?: string;
}

const AUDIT_LOGS_KEY = 'auditLogs';
const COLLECTION_NAME = 'audit_logs';
const MAX_LOCAL_LOGS = 10;

export class AuditService {
  /**
   * Carregar todos os logs de auditoria do Firestore
   */
  async getLogs(): Promise<AuditLog[]> {
    try {
      const logsRef = collection(firestore, COLLECTION_NAME);
      const q = query(logsRef, orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      
      const logs: AuditLog[] = snapshot.docs.map(doc => ({
        id: doc.id,
        action: doc.data().action,
        timestamp: doc.data().timestamp,
        user_id: doc.data().user_id,
        created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at
      }));
      
      return logs;
    } catch (error) {
      console.error('Erro ao carregar logs do Firestore:', error);
      // Fallback para localStorage
      try {
        const saved = localStorage.getItem(AUDIT_LOGS_KEY);
        if (!saved) return [];
        return JSON.parse(saved);
      } catch (localError) {
        console.error('Erro ao carregar logs do localStorage:', localError);
        return [];
      }
    }
  }

  /**
   * Adicionar novo log de auditoria
   * 
   * Também cria uma notificação pessoal PROTEGIDA (não será deletada) para o usuário logado
   * 
   * Chamado por:
   * - handleUpload (Transparency)
   * - handleDelete (Transparency)
   * - handleEdit (Transparency)
   * - handleSaveProfile (Settings)
   * - handleToggle2FA (Settings)
   * - handleAvatarUpload (Settings)
   * - updateSettings (Portal Settings)
   */
  async addLog(action: string): Promise<AuditLog> {
    try {
      const newLog: AuditLog = {
        id: Date.now().toString(),
        action,
        timestamp: this.formatTimestamp(new Date())
      };

      // Tentar salvar no Firestore primeiro
      try {
        const logsRef = collection(firestore, COLLECTION_NAME);
        const docRef = await addDoc(logsRef, {
          action: newLog.action,
          timestamp: newLog.timestamp,
          created_at: serverTimestamp(),
          user_id: 'admin-user'
        });
        newLog.id = docRef.id;
      } catch (firebaseError) {
        console.error('Erro ao salvar log no Firestore, usando localStorage:', firebaseError);
        // Fallback para localStorage
        const logs = await this.getLogs();
        const updated = [newLog, ...logs].slice(0, MAX_LOCAL_LOGS);
        localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(updated));
      }

      // ✨ Criar notificação pessoal PROTEGIDA simultaneamente
      // Notificações protegidas NÃO serão deletadas ao limpar histórico
      try {
        const userProfileStr = localStorage.getItem('userProfile');
        const userId = userProfileStr ? JSON.parse(userProfileStr).id : 'admin-user';
        
        await userNotificationsService.addNotification(userId, action, true); // true = protegida
      } catch (notifError) {
        console.error('Erro ao criar notificação pessoal:', notifError);
        // Não falhar o log se a notificação falhar
      }

      return newLog;
    } catch (error) {
      throw this.handleError(error, 'adicionar log');
    }
  }

  /**
   * Limpar todos os logs
   */
  async clearLogs(): Promise<void> {
    try {
      // Tentar limpar do Firestore
      const logsRef = collection(firestore, COLLECTION_NAME);
      const snapshot = await getDocs(logsRef);
      
      for (const doc of snapshot.docs) {
        await deleteDoc(doc.ref);
      }
    } catch (firebaseError) {
      console.error('Erro ao limpar logs do Firestore:', firebaseError);
      // Fallback para localStorage
      localStorage.removeItem(AUDIT_LOGS_KEY);
    }
  }

  /**
   * Formatar timestamp em pt-BR
   */
  private formatTimestamp(date: Date): string {
    const formattedDate = date.toLocaleDateString('pt-BR');
    const formattedTime = date.toLocaleTimeString('pt-BR');
    return `${formattedDate} às ${formattedTime}`;
  }

  /**
   * Tratamento de erros centralizado
   */
  private handleError(error: unknown, action: string) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error(`Erro ao ${action}:`, error);
    
    return {
      code: 'AUDIT_ERROR',
      message: `Erro ao ${action}: ${message}`,
      status: 500
    };
  }
}

/**
 * Instância singleton do serviço
 * Importar como: import { auditService } from '@/services/auditService'
 */
export const auditService = new AuditService();

/**
 * Exemplos de ações auditadas:
 * 
 * 📤 Arquivo enviado: [nome] ([categoria])
 * 🗑️ Arquivo removido: [nome]
 * ✏️ Arquivo editado: [nome]
 * 📷 Foto de perfil atualizada
 * 📷 Foto de perfil removida
 * ✏️ Perfil atualizado: [displayName]
 * 🔌 Portal configurações salvas
 * 🔐 2FA ativado
 * 🔐 2FA desativado
 */
