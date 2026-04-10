import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Trash2, AlertCircle, Check } from 'lucide-react';
import { useAuditLogs } from '@/hooks/useAuditLogs';

interface Notification {
  id: string;
  message: string;
  timestamp: number;
  read: boolean;
  icon: string;
}

const NotificationPanel: React.FC = () => {
  const { logs } = useAuditLogs();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readNotifications, setReadNotifications] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('readNotifications');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [removedNotifications, setRemovedNotifications] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('removedNotifications');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Converter logs em notificações
  useEffect(() => {
    const newNotifications: Notification[] = logs.slice(0, 8).map((log, index) => {
      const message = typeof log === 'string' ? log : (log as any).action || 'Ação realizada';
      return {
        id: `notif-${index}-${message}`,
        message: message,
        timestamp: Date.now() - (index * 60000), // Simula timestamps progressivos
        read: readNotifications.has(`notif-${index}-${message}`),
        icon: getIconForMessage(message)
      };
    }).filter(notif => !removedNotifications.has(notif.id));
    setNotifications(newNotifications);
  }, [logs, readNotifications, removedNotifications]);

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        buttonRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const getIconForMessage = (message: string | null) => {
    if (!message || typeof message !== 'string') return '📌';
    if (message.includes('enviado')) return '📤';
    if (message.includes('Perfil')) return '👤';
    if (message.includes('Configuração')) return '⚙️';
    if (message.includes('atualizado') || message.includes('Atualizado')) return '🔄';
    if (message.includes('Documento')) return '📄';
    return '📌';
  };

  const getTimeAgo = (timestamp: number) => {
    const diffMs = Date.now() - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'agora mesmo';
    if (diffMins < 60) return `há ${diffMins}m`;
    if (diffHours < 24) return `há ${diffHours}h`;
    if (diffDays < 7) return `há ${diffDays}d`;
    return new Date(timestamp).toLocaleDateString('pt-BR');
  };

  const handleMarkAsRead = (id: string) => {
    const newRead = new Set(readNotifications);
    newRead.add(id);
    setReadNotifications(newRead);
    localStorage.setItem('readNotifications', JSON.stringify(Array.from(newRead)));
  };

  const handleMarkAllAsRead = () => {
    const allIds = new Set(notifications.map(n => n.id));
    setReadNotifications(allIds);
    localStorage.setItem('readNotifications', JSON.stringify(Array.from(allIds)));
  };

  const handleClearAll = () => {
    // Remove apenas as notificações que já foram lidas
    const readNotificationIds = notifications
      .filter(n => n.read)
      .map(n => n.id);
    
    const newRemoved = new Set(removedNotifications);
    readNotificationIds.forEach(id => newRemoved.add(id));
    
    setRemovedNotifications(newRemoved);
    localStorage.setItem('removedNotifications', JSON.stringify(Array.from(newRemoved)));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      {/* Botão do Sino */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all relative group"
        title="Notificações"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 transform group-hover:scale-110 transition-transform">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown de Notificações */}
      {isOpen && (
        <div
          ref={panelRef}
          className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl z-50 overflow-hidden animation-in fade-in"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-slate-600 dark:text-slate-400" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Notificações</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Conteúdo */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <AlertCircle size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-slate-500 dark:text-slate-400 text-sm">Nenhuma notificação</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                    }`}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className="flex gap-3 items-start">
                      <span className="text-lg mt-0.5">{notification.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white break-words">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {getTimeAgo(notification.timestamp)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer com Ações */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex gap-2 justify-between">
              <button
                onClick={handleMarkAllAsRead}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Check size={14} />
                Marcar tudo como lido
              </button>
              <button
                onClick={handleClearAll}
                className="flex items-center justify-center p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Limpar histórico"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
