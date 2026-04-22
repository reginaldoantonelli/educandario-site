/**
 * Serviço de Auditoria
 * 
 * Registra todas as ações do admin
 * Compartilhado entre Transparency e Settings
 * 
 * localStorage: auditLogs (max 10)
 * Supabase: audit_logs table (ilimitado)
 */

import { userNotificationsService } from './userNotificationsService';

interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  timestamp: string;
  created_at?: string;
}

const AUDIT_LOGS_KEY = 'auditLogs';
const MAX_LOCAL_LOGS = 10; // localStorage limita a 10, Supabase será ilimitado

export class AuditService {
  /**
   * Carregar todos os logs de auditoria
   */
  async getLogs(): Promise<AuditLog[]> {
    try {
      const saved = localStorage.getItem(AUDIT_LOGS_KEY);
      if (!saved) return [];
      return JSON.parse(saved);
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
      return [];
    }
  }

  /**
   * Adicionar novo log de auditoria
   * 
   * Também cria uma notificação pessoal para o usuário logado
   * 
   * Chamado por:
   * - handleUpload (Transparency)
   * - handleDelete (Transparency)
   * - handleEdit (Transparency)
   * - handleSaveProfile (Settings)
   * - handleToggle2FA (Settings)
   * - handleAvatarUpload (Settings)
   */
  async addLog(action: string): Promise<AuditLog> {
    try {
      const logs = await this.getLogs();
      
      const newLog: AuditLog = {
        id: Date.now().toString(),
        action,
        timestamp: this.formatTimestamp(new Date())
      };

      // Mantém apenas os últimos MAX_LOCAL_LOGS
      // Em Supabase, todos serão guardados
      const updated = [newLog, ...logs].slice(0, MAX_LOCAL_LOGS);
      localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(updated));

      // ✨ Criar notificação pessoal simultaneamente
      try {
        const userProfileStr = localStorage.getItem('userProfile');
        const userId = userProfileStr ? JSON.parse(userProfileStr).id : 'admin-user';
        
        await userNotificationsService.addNotification(userId, action);
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
   * Limpar todos os logs (cuidado!)
   */
  async clearLogs(): Promise<void> {
    try {
      localStorage.removeItem(AUDIT_LOGS_KEY);
    } catch (error) {
      console.error('Erro ao limpar logs:', error);
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
