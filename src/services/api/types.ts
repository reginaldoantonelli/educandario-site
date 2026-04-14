/**
 * Tipos e Interfaces para os Serviços de API
 * Agnostic (não dependem de Firebase ou Supabase)
 */

// Usuário Autenticado
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

// Documento Público
export interface Document {
  id: string | number;
  title: string;
  category: string;
  year: string;
  visibilidade: 'public' | 'private' | 'restricted';
  fileUrl?: string;
  createdAt: Date;
  updatedAt?: Date;
}

// Notificação
export interface Notification {
  id: string;
  message: string;
  timestamp: number;
  read: boolean;
  userId: string;
}

// Auditoria
export interface AuditLog {
  id: string;
  userId: string;
  action: 'upload' | 'download' | 'delete' | 'edit';
  documentId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}
