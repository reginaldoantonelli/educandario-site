/**
 * Notification Services - Usage Examples
 * 
 * This file contains practical examples of how to use the Notification Services
 * in different scenarios (components, pages, dashboards)
 * 
 * Copy and adapt these patterns to your use case!
 */

// ============================================================================
// EXAMPLE 1: Notification Bell (Header Component)
// ============================================================================

/*
  Location: src/components/Header/NotificationBell.tsx
  
  Usage: Show unread count and list recent notifications
*/

export const NotificationBellExample = () => {
  const { notifications, unreadCount, markAsRead, delete: deleteNotif } = useNotifications();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="relative p-2 text-gray-600 hover:text-gray-900"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-bold">Notificações</h3>
            {unreadCount > 0 && (
              <button
                onClick={async () => {
                  await markAllAsRead();
                }}
                className="text-blue-600 text-sm font-semibold hover:underline"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="divide-y">
            {notifications.slice(0, 5).map((notif) => (
              <div
                key={notif.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notif.read ? 'bg-blue-50' : ''
                }`}
                onClick={() => markAsRead(notif.id)}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{notif.title}</h4>
                    <p className="text-sm text-gray-600">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notif.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotif(notif.id);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* View All Link */}
          <div className="p-3 border-t text-center">
            <a href="/notifications" className="text-blue-600 text-sm font-semibold hover:underline">
              Ver todas as notificações
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// EXAMPLE 2: Notifications Page
// ============================================================================

/*
  Location: src/pages/Notifications/index.tsx
  
  Usage: Display all notifications with filters
*/

export const NotificationsPageExample = () => {
  const { notifications, loading, markAsRead, delete: deleteNotif, deleteAll } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread' | 'success' | 'error' | 'info'>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notificações</h1>
        {notifications.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Deletar todas as notificações?')) {
                deleteAll();
              }
            }}
            className="text-red-600 hover:underline text-sm"
          >
            Limpar tudo
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'unread', 'success', 'error', 'info'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Bell size={48} className="mx-auto mb-4 opacity-50" />
          <p>Nenhuma notificação</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-lg border flex justify-between items-start gap-4 ${
                !notif.read
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex-1">
                <h3 className="font-bold">{notif.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(notif.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="flex gap-2">
                {!notif.read && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Marcar como lida
                  </button>
                )}
                <button
                  onClick={() => deleteNotif(notif.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// EXAMPLE 3: Broadcast Notification (Admin Panel)
// ============================================================================

/*
  Location: src/pages/Admin/BroadcastNotification/index.tsx
  
  Usage: Send notification to multiple users (admin only)
*/

export const BroadcastNotificationExample = () => {
  const { create } = useNotifications();
  const [form, setForm] = useState({
    title: '',
    message: '',
    type: 'info' as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // For broadcast, you'd need admin-only function
      // This is simplified - in real app, call admin API
      await create({
        title: form.title,
        message: form.message,
        type: form.type,
      });
      
      alert('Notificação enviada!');
      setForm({ title: '', message: '', type: 'info' });
    } catch (error) {
      alert('Erro ao enviar');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg">
      <h2 className="text-xl font-bold">Enviar Notificação em Massa</h2>

      <input
        type="text"
        placeholder="Título"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="w-full px-4 py-2 border rounded-lg"
        required
      />

      <textarea
        placeholder="Mensagem"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="w-full px-4 py-2 border rounded-lg h-32"
        required
      />

      <select
        value={form.type}
        onChange={(e) =>
          setForm({
            ...form,
            type: e.target.value as 'info' | 'success' | 'warning' | 'error',
          })
        }
        className="w-full px-4 py-2 border rounded-lg"
      >
        <option value="info">Informativo</option>
        <option value="success">Sucesso</option>
        <option value="warning">Aviso</option>
        <option value="error">Erro</option>
      </select>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
      >
        Enviar
      </button>
    </form>
  );
};

// ============================================================================
// EXAMPLE 4: Notification Toast
// ============================================================================

/*
  Location: src/components/NotificationToast/index.tsx
  
  Usage: Show toast when new notification arrives
*/

export const NotificationToastExample = () => {
  const { notifications } = useNotifications();
  const [toasts, setToasts] = useState<Notification[]>([]);

  useEffect(() => {
    if (notifications.length > toasts.length) {
      const newNotif = notifications[0]; // Most recent
      setToasts((prev) => [newNotif, ...prev].slice(0, 5)); // Keep max 5

      // Auto-remove after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newNotif.id));
      }, 5000);
    }
  }, [notifications]);

  const getToastStyle = (type: string) => {
    const styles: Record<string, string> = {
      success: 'bg-green-500 text-white',
      error: 'bg-red-500 text-white',
      warning: 'bg-yellow-500 text-white',
      info: 'bg-blue-500 text-white',
    };
    return styles[type] || styles.info;
  };

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg shadow-lg max-w-sm animate-in slide-in-from-right-5 fade-in ${getToastStyle(
            toast.type
          )}`}
        >
          <div className="font-semibold">{toast.title}</div>
          <div className="text-sm">{toast.message}</div>
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// EXAMPLE 5: Activity Feed
// ============================================================================

/*
  Location: src/components/Dashboard/ActivityFeed.tsx
  
  Usage: Show recent 'activity' type notifications
*/

export const ActivityFeedExample = () => {
  const { notifications } = useNotifications();

  const activityNotifs = notifications
    .filter((n) => n.type === 'activity')
    .slice(0, 10);

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">Atividades Recentes</h3>

      <div className="space-y-3">
        {activityNotifs.map((notif) => (
          <div key={notif.id} className="flex gap-3 pb-3 border-b last:border-b-0">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold">{notif.title}</p>
              <p className="text-xs text-gray-500">{notif.message}</p>
              <a
                href={notif.actionUrl}
                className="text-xs text-blue-600 hover:underline mt-1"
              >
                Ver mais →
              </a>
            </div>
            <p className="text-xs text-gray-400 flex-shrink-0">
              {formatDistanceToNow(new Date(notif.createdAt), {
                locale: ptBR,
                addSuffix: true,
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// NOTIFICATION TYPES REFERENCE
// ============================================================================

/*
Notification Types:

'info' (Azul)
  └─ Informações gerais
  └─ Ex: "Novo usuário registrado"

'success' (Verde)
  └─ Ações bem-sucedidas
  └─ Ex: "Documento enviado com sucesso"

'warning' (Amarelo)
  └─ Avisos
  └─ Ex: "Limite de armazenamento próximo"

'error' (Vermelho)
  └─ Erros e problemas
  └─ Ex: "Erro ao processar pagamento"

'activity' (Cinza)
  └─ Feed de atividades
  └─ Ex: "Admin [name] deletou documento"
*/

// ============================================================================
// COMMON PATTERNS
// ============================================================================

/*
1. REAL-TIME UPDATES
   ├─ useNotifications() automatically subscribes on mount
   ├─ Use subscribeToChanges() for manual control
   ├─ Use subscribeToUnreadCount() for count-only updates
   └─ Listeners cleanup automatically on unmount

2. UNREAD BADGE
   ├─ Display unreadCount in header/app bar
   ├─ Update automatically via listener
   └─ Decrement when user clicks notification

3. TOAST NOTIFICATIONS
   ├─ Show new notifications as toasts
   ├─ Auto-dismiss after 5 seconds
   └─ Keep max 5 toasts on screen

4. NOTIFICATION CENTER
   ├─ Page showing all notifications
   ├─ Filter by type, read status
   ├─ Bulk actions (mark all, delete all)
   └─ Pagination for large lists

5. BROADCAST (Admin)
   ├─ Only admins can broadcast
   ├─ Send to selected users or all
   ├─ Track delivery status
   └─ Schedule future notifications
*/
