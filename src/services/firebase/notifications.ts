/**
 * Firebase Notification Service Implementation
 * 
 * Handles real-time notifications with:
 * - Real-time listeners for instant updates
 * - Automatic expiration cleanup
 * - Unread count tracking
 * - Broadcast support for admin notifications
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
  orderBy,
  deleteDoc,
  updateDoc,
  addDoc,
  QueryConstraint,
  Timestamp,
  onSnapshot,
  Unsubscribe,
  increment,
  writeBatch,
} from 'firebase/firestore';

import { firestore } from './config';
import { firebaseAuthService } from './auth';
import {
  NotificationService,
  Notification,
  NotificationFilter,
  NotificationStats,
  CreateNotificationInput,
  NotificationServiceError,
} from '../api/notifications';

/**
 * Firebase Notification Service Implementation
 * 
 * Collections:
 * - `notifications`: User notifications
 * - `notification_stats`: Cached stats (for performance)
 */
class FirebaseNotificationService implements NotificationService {
  private readonly notificationsCollection = 'notifications';
  private readonly statsCollection = 'notification_stats';
  private notificationListeners: Map<string, Unsubscribe> = new Map();
  private unreadCountListeners: Map<string, Unsubscribe> = new Map();

  /**
   * Helper: Get current user
   */
  private async getCurrentUser() {
    const user = await firebaseAuthService.getCurrentUser();
    if (!user) {
      throw new NotificationServiceError(
        'Usuário não autenticado',
        'AUTH_REQUIRED'
      );
    }
    return user;
  }

  /**
   * Helper: Convert Firestore document to Notification
   */
  private firebaseDocToNotification(docData: any): Notification {
    return {
      id: docData.id,
      userId: docData.userId,
      title: docData.title,
      message: docData.message,
      type: docData.type || 'info',
      read: docData.read || false,
      createdAt: docData.createdAt?.toDate() || new Date(),
      updatedAt: docData.updatedAt?.toDate(),
      actionUrl: docData.actionUrl,
      data: docData.data,
      expiresAt: docData.expiresAt?.toDate(),
    };
  }

  /**
   * Create notification for current user
   */
  async createNotification(
    input: CreateNotificationInput
  ): Promise<Notification> {
    const user = await this.getCurrentUser();

    try {
      const notification = {
        userId: user.id,
        title: input.title,
        message: input.message,
        type: input.type || 'info',
        read: false,
        createdAt: Timestamp.now(),
        actionUrl: input.actionUrl,
        data: input.data || {},
        expiresAt: input.expiresAt ? Timestamp.fromDate(input.expiresAt) : null,
      };

      const docRef = await addDoc(
        collection(firestore, this.notificationsCollection),
        notification
      );

      // Update stats
      await this.updateStats(user.id, 'increment');

      return this.firebaseDocToNotification({
        id: docRef.id,
        ...notification,
      });
    } catch (error) {
      throw new NotificationServiceError(
        'Erro ao criar notificação',
        'CREATE_FAILED',
        { originalError: (error as Error).message }
      );
    }
  }

  /**
   * Broadcast notification to multiple users (admin only)
   */
  async broadcastNotification(
    userIds: string[],
    input: CreateNotificationInput
  ): Promise<Notification[]> {
    const user = await this.getCurrentUser();

    // Check admin permission
    if (user.role !== 'admin') {
      throw new NotificationServiceError(
        'Sem permissão para enviar notificações em massa',
        'PERMISSION_DENIED'
      );
    }

    try {
      const batch = writeBatch(firestore);
      const notifications: Notification[] = [];
      const now = Timestamp.now();

      for (const userId of userIds) {
        const docRef = doc(collection(firestore, this.notificationsCollection));
        
        const notification = {
          userId,
          title: input.title,
          message: input.message,
          type: input.type || 'info',
          read: false,
          createdAt: now,
          actionUrl: input.actionUrl,
          data: input.data || {},
          expiresAt: input.expiresAt 
            ? Timestamp.fromDate(input.expiresAt)
            : null,
        };

        batch.set(docRef, notification);
        notifications.push(
          this.firebaseDocToNotification({
            id: docRef.id,
            ...notification,
          })
        );
      }

      await batch.commit();
      return notifications;
    } catch (error) {
      throw new NotificationServiceError(
        'Erro ao enviar notificações em massa',
        'BROADCAST_FAILED',
        { originalError: (error as Error).message }
      );
    }
  }

  /**
   * List notifications
   */
  async listNotifications(filter?: NotificationFilter) {
    const user = await this.getCurrentUser();

    try {
      const constraints: QueryConstraint[] = [
        where('userId', '==', user.id),
      ];

      // Filter by type
      if (filter?.type) {
        constraints.push(where('type', '==', filter.type));
      }

      // Filter by read status
      if (filter?.read !== undefined) {
        constraints.push(where('read', '==', filter.read));
      }

      // Sort by date (newest first)
      constraints.push(orderBy('createdAt', 'desc'));

      // Pagination
      if (filter?.limit) {
        constraints.push(limit(filter.limit));
      }

      // TODO: Firebase Firestore v9+ doesn't support offset() - use startAfter() for pagination
      // if (filter?.offset) {
      //   constraints.push(offset(filter.offset));
      // }

      const q = query(collection(firestore, this.notificationsCollection), ...constraints);
      const snapshot = await getDocs(q);

      const notifications = snapshot.docs.map((doc) =>
        this.firebaseDocToNotification({ id: doc.id, ...doc.data() })
      );

      // Get total count (without pagination)
      const countConstraints = constraints.filter(
        (c) => !c.toJSON().toString().includes('limit')
      );
      const countQuery = query(
        collection(firestore, this.notificationsCollection),
        ...countConstraints
      );
      const countSnapshot = await getDocs(countQuery);

      return {
        notifications,
        total: countSnapshot.size,
        hasMore: notifications.length < countSnapshot.size,
      };
    } catch (error) {
      throw new NotificationServiceError(
        'Erro ao listar notificações',
        'LIST_FAILED',
        { originalError: (error as Error).message }
      );
    }
  }

  /**
   * Get specific notification
   */
  async getNotification(notificationId: string): Promise<Notification> {
    const user = await this.getCurrentUser();

    try {
      const docRef = doc(firestore, this.notificationsCollection, notificationId);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        throw new NotificationServiceError(
          'Notificação não encontrada',
          'NOTIFICATION_NOT_FOUND'
        );
      }

      const data = snapshot.data();

      // Check ownership
      if (data.userId !== user.id && user.role !== 'admin') {
        throw new NotificationServiceError(
          'Sem permissão para acessar esta notificação',
          'PERMISSION_DENIED'
        );
      }

      return this.firebaseDocToNotification({
        id: snapshot.id,
        ...data,
      });
    } catch (error) {
      if (error instanceof NotificationServiceError) {
        throw error;
      }
      throw new NotificationServiceError(
        'Erro ao obter notificação',
        'GET_FAILED',
        { originalError: (error as Error).message }
      );
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    const user = await this.getCurrentUser();

    try {
      const docRef = doc(firestore, this.notificationsCollection, notificationId);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        throw new NotificationServiceError(
          'Notificação não encontrada',
          'NOTIFICATION_NOT_FOUND'
        );
      }

      const data = snapshot.data();

      // Check ownership
      if (data.userId !== user.id) {
        throw new NotificationServiceError(
          'Sem permissão',
          'PERMISSION_DENIED'
        );
      }

      // Only update if currently unread
      if (!data.read) {
        await updateDoc(docRef, {
          read: true,
          updatedAt: Timestamp.now(),
        });

        // Update stats
        await this.updateStats(user.id, 'decrement');
      }
    } catch (error) {
      if (error instanceof NotificationServiceError) {
        throw error;
      }
      throw new NotificationServiceError(
        'Erro ao marcar como lido',
        'UPDATE_FAILED',
        { originalError: (error as Error).message }
      );
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    const user = await this.getCurrentUser();

    try {
      const q = query(
        collection(firestore, this.notificationsCollection),
        where('userId', '==', user.id),
        where('read', '==', false)
      );

      const snapshot = await getDocs(q);
      const batch = writeBatch(firestore);
      const now = Timestamp.now();

      snapshot.docs.forEach((doc) => {
        batch.update(doc.ref, {
          read: true,
          updatedAt: now,
        });
      });

      await batch.commit();

      // Reset unread count
      const statsRef = doc(firestore, this.statsCollection, user.id);
      await updateDoc(statsRef, {
        unread: 0,
        updatedAt: now,
      });
    } catch (error) {
      throw new NotificationServiceError(
        'Erro ao marcar todas as notificações como lidas',
        'UPDATE_ALL_FAILED',
        { originalError: (error as Error).message }
      );
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    const user = await this.getCurrentUser();

    try {
      const docRef = doc(firestore, this.notificationsCollection, notificationId);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        throw new NotificationServiceError(
          'Notificação não encontrada',
          'NOTIFICATION_NOT_FOUND'
        );
      }

      const data = snapshot.data();

      // Check ownership
      if (data.userId !== user.id && user.role !== 'admin') {
        throw new NotificationServiceError(
          'Sem permissão',
          'PERMISSION_DENIED'
        );
      }

      await deleteDoc(docRef);

      // Update stats if was unread
      if (!data.read) {
        await this.updateStats(user.id, 'decrement');
      }
    } catch (error) {
      if (error instanceof NotificationServiceError) {
        throw error;
      }
      throw new NotificationServiceError(
        'Erro ao deletar notificação',
        'DELETE_FAILED',
        { originalError: (error as Error).message }
      );
    }
  }

  /**
   * Delete all notifications
   */
  async deleteAllNotifications(): Promise<void> {
    const user = await this.getCurrentUser();

    try {
      const q = query(
        collection(firestore, this.notificationsCollection),
        where('userId', '==', user.id)
      );

      const snapshot = await getDocs(q);
      const batch = writeBatch(firestore);

      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      // Reset stats
      const statsRef = doc(firestore, this.statsCollection, user.id);
      await updateDoc(statsRef, {
        total: 0,
        unread: 0,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      throw new NotificationServiceError(
        'Erro ao deletar todas as notificações',
        'DELETE_ALL_FAILED',
        { originalError: (error as Error).message }
      );
    }
  }

  /**
   * Get unread count
   */
  async getUnreadCount(): Promise<number> {
    const user = await this.getCurrentUser();

    try {
      const q = query(
        collection(firestore, this.notificationsCollection),
        where('userId', '==', user.id),
        where('read', '==', false)
      );

      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      throw new NotificationServiceError(
        'Erro ao obter contagem de não lidas',
        'COUNT_FAILED',
        { originalError: (error as Error).message }
      );
    }
  }

  /**
   * Get notification statistics
   */
  async getStats(): Promise<NotificationStats> {
    const user = await this.getCurrentUser();

    try {
      const q = query(
        collection(firestore, this.notificationsCollection),
        where('userId', '==', user.id)
      );

      const snapshot = await getDocs(q);
      const stats: NotificationStats = {
        total: snapshot.size,
        unread: 0,
        byType: {
          info: 0,
          success: 0,
          warning: 0,
          error: 0,
          activity: 0,
        },
      };

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (!data.read) stats.unread++;
        
        const type = data.type || 'info';
        if (type in stats.byType) {
          stats.byType[type as keyof typeof stats.byType]++;
        }
      });

      return stats;
    } catch (error) {
      throw new NotificationServiceError(
        'Erro ao obter estatísticas',
        'STATS_FAILED',
        { originalError: (error as Error).message }
      );
    }
  }

  /**
   * Subscribe to real-time notification changes
   */
  onNotificationsChange(
    callback: (notifications: Notification[]) => void
  ): () => void {
    const user = firebaseAuthService.getCurrentUser().then((u) => u?.id);

    user.then((userId) => {
      if (!userId) return;

      const q = query(
        collection(firestore, this.notificationsCollection),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const notifications = snapshot.docs.map((doc) =>
          this.firebaseDocToNotification({ id: doc.id, ...doc.data() })
        );
        callback(notifications);
      });

      this.notificationListeners.set(userId, unsubscribe);
    });

    // Return cleanup function
    return () => {
      user.then((userId) => {
        if (userId && this.notificationListeners.has(userId)) {
          this.notificationListeners.get(userId)?.();
          this.notificationListeners.delete(userId);
        }
      });
    };
  }

  /**
   * Subscribe to unread count changes
   */
  onUnreadCountChange(callback: (count: number) => void): () => void {
    const user = firebaseAuthService.getCurrentUser().then((u) => u?.id);

    user.then((userId) => {
      if (!userId) return;

      const q = query(
        collection(firestore, this.notificationsCollection),
        where('userId', '==', userId),
        where('read', '==', false)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        callback(snapshot.size);
      });

      this.unreadCountListeners.set(userId, unsubscribe);
    });

    // Return cleanup function
    return () => {
      user.then((userId) => {
        if (userId && this.unreadCountListeners.has(userId)) {
          this.unreadCountListeners.get(userId)?.();
          this.unreadCountListeners.delete(userId);
        }
      });
    };
  }

  /**
   * Helper: Update notification stats
   */
  private async updateStats(userId: string, action: 'increment' | 'decrement') {
    try {
      const statsRef = doc(firestore, this.statsCollection, userId);

      await updateDoc(statsRef, {
        unread: increment(action === 'increment' ? 1 : -1),
        total: increment(action === 'increment' ? 1 : 0),
        updatedAt: Timestamp.now(),
      }).catch(async () => {
        // Create stats doc if doesn't exist
        await setDoc(statsRef, {
          userId,
          total: action === 'increment' ? 1 : 0,
          unread: 1,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      });
    } catch (error) {
      console.error('Failed to update stats:', error);
    }
  }

  /**
   * Cleanup: Unsubscribe from all listeners
   */
  cleanup(): void {
    this.notificationListeners.forEach((unsubscribe) => unsubscribe());
    this.unreadCountListeners.forEach((unsubscribe) => unsubscribe());
    this.notificationListeners.clear();
    this.unreadCountListeners.clear();
  }
}

// Export singleton instance
export const firebaseNotificationService =
  new FirebaseNotificationService();
