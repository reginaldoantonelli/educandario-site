import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Trash2, AlertCircle, Check } from 'lucide-react';
import { useUserNotifications } from '@/hooks/useUserNotifications';

interface Notification {
  id: string;
  message: string;
  timestamp: number;
  read: boolean;
  icon: string;
}

const NotificationPanel: React.FC = () => {
  const { notifications: userNotifications, fetchNotifications, deleteNotification, markAsRead, clearReadNotifications } = useUserNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readNotifications, setReadNotifications] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('readNotifications');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  // Atualizar currentTime para evitar chamar Date.now() durante render
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000); // Atualizar a cada minuto

    return () => clearInterval(interval);
  }, []);

  // Função para pegar ícone baseado na mensagem
  const getIconForMessage = (message: string | null) => {
    if (!message || typeof message !== 'string') return '📌';
    if (message.includes('enviado')) return '📤';
    if (message.includes('Perfil')) return '👤';
    if (message.includes('Configuração')) return '⚙️';
    if (message.includes('atualizado') || message.includes('Atualizado')) return '🔄';
    if (message.includes('Documento')) return '📄';
    return '📌';
  };

  // Mapear notificações do hook para o estado local com read state
  useEffect(() => {
    const newNotifications: Notification[] = userNotifications.map((notif) => {
      return {
        id: notif.id,
        message: notif.message,
        timestamp: notif.timestamp,
        read: readNotifications.has(notif.id),
        icon: getIconForMessage(notif.message),
      };
    });
    
    // eslint-disable-next-line
    setNotifications(newNotifications);
  }, [userNotifications, readNotifications]);

  // Poll para recarregar notificações a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

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

  const getTimeAgo = (timestamp: number) => {
    // Se timestamp é inválido, retorna N/A
    if (!timestamp || typeof timestamp !== 'number') {
      return 'Data inválida';
    }

    const diffMs = currentTime - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'agora mesmo';
    if (diffMins < 60) return `há ${diffMins}m`;
    if (diffHours < 24) return `há ${diffHours}h`;
    if (diffDays < 7) return `há ${diffDays}d`;
    
    // Formato: 10/04/2026 às 17:02
    const date = new Date(timestamp);
    const datePart = date.toLocaleDateString('pt-BR');
    const timePart = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return `${datePart} às ${timePart}`;
  };

  const handleMarkAsRead = async (id: string) => {
    const newRead = new Set(readNotifications);
    newRead.add(id);
    setReadNotifications(newRead);
    localStorage.setItem('readNotifications', JSON.stringify(Array.from(newRead)));
    
    try {
      await markAsRead(id);
    } catch (error) {
      console.error('Erro ao marcar como lido:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    const allIds = new Set(notifications.map(n => n.id));
    setReadNotifications(allIds);
    localStorage.setItem('readNotifications', JSON.stringify(Array.from(allIds)));
    
    // Marcar como lido no backend para cada notificação
    try {
      for (const notification of notifications) {
        if (!notification.read) {
          await markAsRead(notification.id);
        }
      }
    } catch (error) {
      console.error('Erro ao marcar notificações como lidas:', error);
    }
  };

  const handleClearAll = async () => {
    // Deletar notificações lidas via hook
    try {
      await clearReadNotifications();
      // Limpar localStorage apenas após sucesso
      setReadNotifications(new Set());
      localStorage.setItem('readNotifications', JSON.stringify([]));
    } catch (error) {
      console.error('Erro ao limpar notificações:', error);
    }
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
                    className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer flex justify-between items-start ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                    } ${notification.protected ? 'border-l-2 border-l-yellow-400' : ''}`}
                  >
                    <div 
                      className="flex-1 flex gap-3 items-start"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <span className="text-lg mt-0.5">{notification.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white wrap-break-word">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {getTimeAgo(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0"></div>
                      )}
                      {notification.protected && (
                        <div className="text-yellow-500 text-xs font-bold shrink-0" title="Notificação protegida - Histórico de auditoria">
                          🔒
                        </div>
                      )}
                      {!notification.protected && (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              await deleteNotification(notification.id);
                            } catch (error) {
                              console.error('Erro ao deletar notificação:', error);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                          title="Remover notificação"
                        >
                          <Trash2 size={14} />
                        </button>
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
