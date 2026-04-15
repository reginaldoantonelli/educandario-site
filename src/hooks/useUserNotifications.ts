/**
 * Hook useUserNotifications
 * 
 * Gerencia notificações pessoais do usuário logado
 * Notificações podem ser deletadas individualmente
 * Não afeta o histórico global de auditoria
 * 
 * Uso no NotificationPanel:
 * const { notifications, deleteNotification, clearReadNotifications } = useUserNotifications();
 */

import { useState, useCallback, useEffect } from 'react';
import { userNotificationsService } from '@/services/userNotificationsService';

interface UserNotification {
  id: string;
  user_id?: string;
  message: string;
  timestamp: number;
  created_at?: string;
  read?: boolean;
  protected?: boolean; // Se true, não pode ser deletada
}

export interface UseUserNotificationsReturn {
  notifications: UserNotification[];
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  clearReadNotifications: () => Promise<void>;
  clearError: () => void;
}

export const useUserNotifications = () => {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obter ID do usuário (pode vir de context, localStorage, ou props)
  // Por enquanto, usa um ID padrão ou do localStorage
  const getUserId = useCallback(() => {
    // Tenta pegar do localStorage ou usa default
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      try {
        const parsedProfile = JSON.parse(profile);
        return parsedProfile.id || 'admin-user';
      } catch {
        return 'admin-user';
      }
    }
    return 'admin-user';
  }, []);

  // Carregar notificações ao montar
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = getUserId();
      const data = await userNotificationsService.getNotifications(userId);
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar notificações');
      console.error('Erro ao buscar notificações:', err);
    } finally {
      setLoading(false);
    }
  }, [getUserId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Deletar notificação individual
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      setError(null);
      const userId = getUserId();
      
      // Deletar SEM PROTEÇÃO - notificações no sino podem ser deletadas
      await userNotificationsService.deleteNotification(userId, notificationId);
      // Atualizar state removendo a notificação
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao deletar notificação';
      setError(errorMsg);
      throw err;
    }
  }, [getUserId]);

  // Marcar como lida
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      setError(null);
      const userId = getUserId();
      await userNotificationsService.markAsRead(userId, notificationId);
      // Atualizar state
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao marcar como lida';
      setError(errorMsg);
      throw err;
    }
  }, [getUserId]);

  // Limpar notificações lidas
  const clearReadNotifications = useCallback(async () => {
    try {
      setError(null);
      const userId = getUserId();
      
      // Atualização otimista usando função de estado anterior (evita dependency array issues)
      // Remove TODAS as lidas (sem proteção no sino)
      setNotifications(prev => prev.filter(n => !n.read));
      
      // Depois chamar o serviço para sincronizar
      await userNotificationsService.clearReadNotifications(userId);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao limpar notificações';
      setError(errorMsg);
      // NÃO throw - apenas registrar erro mas manter a atualização otimista
      console.error('Erro ao limpar notificações:', err);
    }
  }, [getUserId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    deleteNotification,
    markAsRead,
    clearReadNotifications,
    clearError
  };
};
