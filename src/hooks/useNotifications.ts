/**
 * useNotifications Hook (Firebase Implementation)
 * 
 * React hook for managing notifications
 * Includes real-time updates and unread count tracking
 * 
 * Usage:
 * const { notifications, unreadCount, create, markAsRead } = useNotifications();
 */

import { useState, useCallback, useEffect } from 'react';
import type {
  Notification,
  NotificationFilter,
  NotificationStats,
  CreateNotificationInput,
} from '@/services/api/notifications';
import { NotificationServiceError } from '@/services/api/notifications';
import { firebaseNotificationService } from '@/services/firebase/notifications';

interface UseNotificationsReturn {
  // State
  notifications: Notification[];
  loading: boolean;
  error: NotificationServiceError | null;
  unreadCount: number;
  stats: NotificationStats | null;

  // Operations
  create: (input: CreateNotificationInput) => Promise<Notification>;
  list: (filter?: NotificationFilter) => Promise<void>;
  get: (notificationId: string) => Promise<Notification>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  delete: (notificationId: string) => Promise<void>;
  deleteAll: () => Promise<void>;
  getStats: () => Promise<NotificationStats>;

  // Real-time
  subscribeToChanges: () => () => void;
  subscribeToUnreadCount: () => () => void;
  clearError: () => void;
}

/**
 * Hook for notification management
 * Provides state and methods for notification operations
 */
export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<NotificationServiceError | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState<NotificationStats | null>(null);

  // Create notification
  const create = useCallback(async (input: CreateNotificationInput) => {
    try {
      setError(null);
      const result = await firebaseNotificationService.createNotification(input);
      
      // Add to list
      setNotifications((prev) => [result, ...prev]);
      
      // Increment unread count
      setUnreadCount((prev) => prev + 1);
      
      return result;
    } catch (err) {
      const error = err as NotificationServiceError;
      setError(error);
      throw error;
    }
  }, []);

  // List notifications
  const list = useCallback(async (filter?: NotificationFilter) => {
    try {
      setLoading(true);
      setError(null);

      const result = await firebaseNotificationService.listNotifications(filter);
      setNotifications(result.notifications);
    } catch (err) {
      const error = err as NotificationServiceError;
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get notification
  const get = useCallback(async (notificationId: string) => {
    try {
      setError(null);
      return await firebaseNotificationService.getNotification(notificationId);
    } catch (err) {
      const error = err as NotificationServiceError;
      setError(error);
      throw error;
    }
  }, []);

  // Mark as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      setError(null);
      await firebaseNotificationService.markAsRead(notificationId);

      // Update in list  
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );

      // Decrement unread count
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      const error = err as NotificationServiceError;
      setError(error);
      throw error;
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      setError(null);
      await firebaseNotificationService.markAllAsRead();

      // Update all in list
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );

      // Reset unread count
      setUnreadCount(0);
    } catch (err) {
      const error = err as NotificationServiceError;
      setError(error);
      throw error;
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      setError(null);

      // Check if was unread before deleting
      const notification = notifications.find((n) => n.id === notificationId);
      const wasUnread = notification?.read === false;

      await firebaseNotificationService.deleteNotification(notificationId);

      // Remove from list
      setNotifications((prev) =>
        prev.filter((n) => n.id !== notificationId)
      );

      // Update unread count if was unread
      if (wasUnread) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      const error = err as NotificationServiceError;
      setError(error);
      throw error;
    }
  }, [notifications]);

  // Delete all notifications
  const deleteAll = useCallback(async () => {
    try {
      setError(null);
      await firebaseNotificationService.deleteAllNotifications();

      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      const error = err as NotificationServiceError;
      setError(error);
      throw error;
    }
  }, []);

  // Get statistics
  const getStats = useCallback(async () => {
    try {
      setError(null);
      const result = await firebaseNotificationService.getStats();
      setStats(result);
      return result;
    } catch (err) {
      const error = err as NotificationServiceError;
      setError(error);
      throw error;
    }
  }, []);

  // Subscribe to real-time changes
  const subscribeToChanges = useCallback(() => {
    return firebaseNotificationService.onNotificationsChange((notifications) => {
      setNotifications(notifications);
    });
  }, []);

  // Subscribe to unread count changes
  const subscribeToUnreadCount = useCallback(() => {
    return firebaseNotificationService.onUnreadCountChange((count) => {
      setUnreadCount(count);
    });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load initial data on mount
  useEffect(() => {
    const unsubscribeNotifications = subscribeToChanges();
    const unsubscribeUnread = subscribeToUnreadCount();

    return () => {
      unsubscribeNotifications();
      unsubscribeUnread();
    };
  }, [subscribeToChanges, subscribeToUnreadCount]);

  return {
    notifications,
    loading,
    error,
    unreadCount,
    stats,
    create,
    list,
    get,
    markAsRead,
    markAllAsRead,
    delete: deleteNotification,
    deleteAll,
    getStats,
    subscribeToChanges,
    subscribeToUnreadCount,
    clearError,
  };
};
