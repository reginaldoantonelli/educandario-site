/**
 * Notification Service - Agnostic Interface Layer
 * 
 * This interface defines the contract for notification operations
 * Independent from Firebase/Supabase implementation details.
 * 
 * Allows future migration to different backends without changing component code.
 */

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'activity';
  read: boolean;
  createdAt: Date;
  updatedAt?: Date;
  actionUrl?: string; // URL to navigate to when clicked
  data?: Record<string, any>; // Additional context data
  expiresAt?: Date; // Auto-delete notification after this date
}

export interface NotificationFilter {
  type?: Notification['type'];
  read?: boolean;
  limit?: number;
  offset?: number;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<Notification['type'], number>;
}

export interface CreateNotificationInput {
  title: string;
  message: string;
  type?: Notification['type'];
  actionUrl?: string;
  data?: Record<string, any>;
  expiresAt?: Date;
}

export interface NotificationService {
  /**
   * Create a notification for current user
   */
  createNotification(
    input: CreateNotificationInput
  ): Promise<Notification>;

  /**
   * Create notifications for multiple users (admin only)
   */
  broadcastNotification(
    userIds: string[],
    input: CreateNotificationInput
  ): Promise<Notification[]>;

  /**
   * Get notifications with optional filtering
   */
  listNotifications(filter?: NotificationFilter): Promise<{
    notifications: Notification[];
    total: number;
    hasMore: boolean;
  }>;

  /**
   * Get specific notification
   */
  getNotification(notificationId: string): Promise<Notification>;

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): Promise<void>;

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): Promise<void>;

  /**
   * Delete notification
   */
  deleteNotification(notificationId: string): Promise<void>;

  /**
   * Delete all notifications
   */
  deleteAllNotifications(): Promise<void>;

  /**
   * Get unread count
   */
  getUnreadCount(): Promise<number>;

  /**
   * Get notification statistics
   */
  getStats(): Promise<NotificationStats>;

  /**
   * Subscribe to real-time changes
   * Returns unsubscribe function
   */
  onNotificationsChange(
    callback: (notifications: Notification[]) => void
  ): () => void;

  /**
   * Subscribe to unread count changes
   * Returns unsubscribe function
   */
  onUnreadCountChange(callback: (count: number) => void): () => void;
}

export interface NotificationError extends Error {
  code: string;
  context?: Record<string, any>;
}

/**
 * Custom Error Class for Notification Operations
 */
export class NotificationServiceError extends Error implements NotificationError {
  code: string;
  context?: Record<string, any>;

  constructor(
    message: string,
    code: string,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'NotificationServiceError';
    this.code = code;
    this.context = context;
  }
}
