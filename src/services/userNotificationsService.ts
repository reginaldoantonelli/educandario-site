/**
 * Serviço de Notificações Pessoais do Usuário
 * 
 * Armazena notificações APENAS do usuário logado
 * Pode ser deletado sem afetar o histórico global
 * Cada usuário tem seu próprio armazenamento
 * 
 * localStorage: userNotifications_[userId]
 */

interface UserNotification {
  id: string;
  user_id?: string;
  message: string;
  timestamp: number;
  created_at?: string;
  read?: boolean;
}

class UserNotificationsService {
  private readonly STORAGE_PREFIX = 'userNotifications_';
  private readonly MAX_NOTIFICATIONS = 50; // Limite de notificações por usuário

  /**
   * Carregar notificações do usuário específico
   */
  async getNotifications(userId: string): Promise<UserNotification[]> {
    try {
      const key = `${this.STORAGE_PREFIX}${userId}`;
      const saved = localStorage.getItem(key);
      if (!saved) return [];
      return JSON.parse(saved);
    } catch (error) {
      console.error('Erro ao carregar notificações do usuário:', error);
      return [];
    }
  }

  /**
   * Adicionar nova notificação para o usuário
   */
  async addNotification(userId: string, action: string): Promise<UserNotification> {
    try {
      const notifications = await this.getNotifications(userId);
      
      const newNotification: UserNotification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        user_id: userId,
        message: action,
        timestamp: Date.now(),
        created_at: new Date().toISOString(),
        read: false
      };

      // Adiciona no início (mais recente primeiro)
      notifications.unshift(newNotification);

      // Limita ao máximo de notificações
      if (notifications.length > this.MAX_NOTIFICATIONS) {
        notifications.pop();
      }

      const key = `${this.STORAGE_PREFIX}${userId}`;
      localStorage.setItem(key, JSON.stringify(notifications));

      console.log(`✨ Notificação criada para ${userId}:`, action);
      return newNotification;
    } catch (error) {
      console.error('Erro ao adicionar notificação:', error);
      throw error;
    }
  }

  /**
   * Marcar notificação como lida
   */
  async markAsRead(userId: string, notificationId: string): Promise<void> {
    try {
      const notifications = await this.getNotifications(userId);
      const notification = notifications.find(n => n.id === notificationId);
      
      if (notification) {
        notification.read = true;
        const key = `${this.STORAGE_PREFIX}${userId}`;
        localStorage.setItem(key, JSON.stringify(notifications));
      }
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      throw error;
    }
  }

  /**
   * Deletar notificação individual do usuário
   */
  async deleteNotification(userId: string, notificationId: string): Promise<void> {
    try {
      let notifications = await this.getNotifications(userId);
      notifications = notifications.filter(n => n.id !== notificationId);
      
      const key = `${this.STORAGE_PREFIX}${userId}`;
      localStorage.setItem(key, JSON.stringify(notifications));
      
      console.log(`🗑️ Notificação deletada para ${userId}`);
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
      throw error;
    }
  }

  /**
   * Deletar todas as notificações lidas do usuário
   */
  async clearReadNotifications(userId: string): Promise<void> {
    try {
      let notifications = await this.getNotifications(userId);
      notifications = notifications.filter(n => !n.read);
      
      const key = `${this.STORAGE_PREFIX}${userId}`;
      localStorage.setItem(key, JSON.stringify(notifications));
      
      console.log(`🗑️ Notificações lidas limpas para ${userId}`);
    } catch (error) {
      console.error('Erro ao limpar notificações lidas:', error);
      throw error;
    }
  }

  /**
   * Limpar TODAS as notificações do usuário
   */
  async clearAllNotifications(userId: string): Promise<void> {
    try {
      const key = `${this.STORAGE_PREFIX}${userId}`;
      localStorage.removeItem(key);
      
      console.log(`🗑️ Todas as notificações limpas para ${userId}`);
    } catch (error) {
      console.error('Erro ao limpar todas as notificações:', error);
      throw error;
    }
  }
}

export const userNotificationsService = new UserNotificationsService();
